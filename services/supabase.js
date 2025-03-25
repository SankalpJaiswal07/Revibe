import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-url-polyfill/auto";
import { AppState } from "react-native";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_API;

// Initialize Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const signUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) throw error;

    return data;
  } catch (error) {
    throw error;
  }
};

const login = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return data;
  } catch (error) {
    throw error;
  }
};

const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};

const getUserAuthDetails = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};

const getCombinedUserData = async () => {
  try {
    // Fetch user metadata
    const user = await getUserAuthDetails();

    if (!user) {
      throw new Error("User not authenticated or metadata unavailable.");
    }

    // Fetch user data from the `users` table
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single(); // Fetch a single user record by ID

    if (fetchError) {
      console.error(
        "Error fetching user data from the users table:",
        fetchError.message
      );
      throw new Error("Unable to fetch user data from the users table.");
    }

    // Combine user metadata and user data
    const combinedData = {
      ...user, // Spread metadata from getUserAuthDetails
      username: userData.username,
      profile_picture_url: userData.profile_picture_url,
      created_at: userData.created_at,
    };

    return combinedData;
  } catch (error) {
    console.error("Error combining user data:", error.message);
    throw error; // Re-throw the error to handle it where the function is called
  }
};

async function updatePassword(currentPassword, newPassword) {
  try {
    const user = (await supabase.auth.getSession()).data.session.user;
    const userId = (await supabase.auth.getSession()).data.session.user.id;

    if (!userId) {
      throw new Error("User not authenticated.");
    }

    if (currentPassword && newPassword) {
      const { data: session, error: authError } =
        await supabase.auth.signInWithPassword({
          email: user.email || "",
          password: currentPassword,
        });

      if (authError || !session) {
        throw new Error("Invalid current password.");
      }

      const { data, error: passwordError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (passwordError) {
        throw new Error("Failed to update password: " + passwordError.message);
      }
      if (data && data.length > 0) {
        return { success: true, message: "Username updated successfully." };
      }
    }
  } catch (error) {
    console.error("Error updating password:", error.message);
    return { success: false, message: error.message };
  }
}
const updateProfilePicture = async (profilePictureURL) => {
  try {
    const userId = (await supabase.auth.getSession()).data.session.user.id;
    if (!userId) {
      throw new Error("User not authenticated.");
    }

    let newProfilePictureUrl = null;
    if (profilePictureURL) {
      const avatarBucket = "avatars";

      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("profile_picture_url")
        .eq("id", userId)
        .single();

      if (profileError) {
        throw new Error(
          "Failed to fetch user profile: " + profileError.message
        );
      }

      const existingFileName = userProfile.profile_picture_url
        ? userProfile.profile_picture_url.split("/avatars/").pop()
        : null;

      if (existingFileName) {
        const { error: deleteError } = await supabase.storage
          .from(avatarBucket)
          .remove([existingFileName]);

        if (deleteError) {
          throw new Error(
            "Failed to delete existing profile picture: " + deleteError.message
          );
        }
      }
      const base64 = await FileSystem.readAsStringAsync(profilePictureURL, {
        encoding: "base64",
      });

      const filePath = `${userId}/${new Date().getTime()}.${
        profilePictureURL.type === "image/png" ? "png" : "jpg"
      }`;

      const contentType =
        profilePictureURL.type === "image" ? "image/png" : "image/jpeg";

      const { error: uploadError } = await supabase.storage
        .from(avatarBucket)
        .upload(filePath, decode(base64), { contentType });

      if (uploadError) {
        throw new Error(
          "Failed to upload new profile picture: " + uploadError.message
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from(avatarBucket)
        .getPublicUrl(filePath);

      newProfilePictureUrl = publicUrlData.publicUrl;

      const { error: updateError } = await supabase
        .from("users")
        .update({ profile_picture_url: newProfilePictureUrl })
        .eq("id", userId);

      if (updateError) {
        throw new Error(
          "Failed to update profile picture URL: " + updateError.message
        );
      }
    }

    return { success: true, message: "Profile picture updated successfully." };
  } catch (error) {
    console.error("Error updating profile picture:", error.message);
    return { success: false, message: error.message };
  }
};

const updateUsername = async (username) => {
  try {
    const userId = (await supabase.auth.getSession()).data.session.user.id;

    if (!userId) {
      throw new Error("User not authenticated.");
    }

    if (username) {
      const { data, error } = await supabase
        .from("users")
        .update({ username: `${username}` })
        .eq("id", userId)
        .select("username");

      if (error) {
        throw new Error("Failed to update username: " + error);
      }

      if (data && data.length > 0) {
        return { success: true, message: "Username updated successfully." };
      }
    }
  } catch (error) {
    console.error("Error updating username:", error.message);
    return { success: false, message: error.message };
  }
};

export {
  supabase,
  signUp,
  login,
  logout,
  getUserAuthDetails,
  getCombinedUserData,
  updatePassword,
  updateProfilePicture,
  updateUsername,
};
