import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useState } from "react";

import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useNavigation } from "@react-navigation/native";
import { login } from "../services/supabase";
import CustomLoader from "../components/CustomLoader";
import AntDesign from "@expo/vector-icons/AntDesign";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureEntery, setSecureEntery] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = () => {
    navigation.navigate("Signup");
  };

  const handleLogin = async () => {
    setErrorMessage(""); // Clear previous errors
    setIsEmailError(false);
    setIsPasswordError(false);

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      await login(email, password); // Attempt login
    } catch (error) {
      let errorText = "Login failed. Please try again."; // Default error message
      if (error.message === "Invalid login credentials") {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(errorText);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <CustomLoader loadingText="Signing in..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.illustrationContainer}>
        <Image
          source={require("../assets/illustration/login.png")}
          style={styles.illustration}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
      </View>
      {/* form */}
      <View style={styles.formContainer}>
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}
        <View
          style={[
            styles.inputContainer,
            isEmailError && styles.inputContainerError,
          ]}
        >
          <Ionicons name={"mail-outline"} size={30} color={"#fff"} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            placeholderTextColor={"#fff"}
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
          />
        </View>
        {isEmailError && <Text style={styles.errorText}>Invalid email</Text>}
        <View style={[styles.inputContainer]}>
          <SimpleLineIcons name={"lock"} size={30} color={"#fff"} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your password"
            placeholderTextColor={"#fff"}
            secureTextEntry={secureEntery}
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity
            onPress={() => {
              setSecureEntery((prev) => !prev);
            }}
          >
            <SimpleLineIcons name={"eye"} size={20} color={"#fff"} />
          </TouchableOpacity>
        </View>
        {isPasswordError && (
          <Text style={styles.errorText}>Incorrect password</Text>
        )}

        <TouchableOpacity
          style={styles.loginButtonWrapper}
          onPress={handleLogin}
        >
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Sign In</Text>
            <AntDesign name="login" size={24} color="white" />
          </View>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.accountText}>Don’t have an account?</Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingVertical: height * 0.04,
  },
  illustrationContainer: {
    alignItems: "center",
  },
  illustration: {
    width: width * 1, // 80% of screen width
    height: height * 0.3,
    resizeMode: "contain",
    backgroundColor: "#fff",
  },
  textContainer: {
    marginTop: height * 0.01,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  headingText: {
    fontSize: width * 0.1,
    fontFamily: "NacelleBlack",
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: width * 0.04,
    color: "#f3efef",
    fontFamily: "NacelleRegular",
    fontWeight: "400",
  },
  formContainer: {
    marginTop: 10,
    paddingHorizontal: width * 0.05,
    justifyContent: "center",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    padding: height * 0.01,
    marginVertical: height * 0.01,
  },
  inputContainerError: {
    borderColor: "red", // Highlight border in red for error
  },
  textInput: {
    flex: 1,
    paddingHorizontal: width * 0.03,
    color: "#fff",
    fontFamily: "NacelleRegular",
    fontWeight: "400",
  },
  errorText: {
    color: "red",
    marginTop: -height * 0.01,
    marginBottom: height * 0.01,
    fontSize: width * 0.03,
    fontFamily: "NacelleRegular",
    fontWeight: "400",
  },
  errorMessage: {
    color: "red",
    fontSize: width * 0.035,
    marginBottom: height * 0.01,
    textAlign: "center",
    fontFamily: "NacelleRegular",
    fontWeight: "400",
  },

  loginButtonWrapper: {
    flexDirection: "row",
    backgroundColor: "green",
    borderRadius: 100,
    marginTop: height * 0.02,
    padding: height * 0.01,
  },
  loginContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loginText: {
    color: "#fff",
    fontSize: width * 0.05,
    textAlign: "center",
    fontFamily: "NacelleBold",
    fontWeight: "700",
  },
  continueText: {
    textAlign: "center",
    marginVertical: height * 0.02,
    fontSize: width * 0.04,
    color: "#fff",
    fontFamily: "NacelleRegular",
    fontWeight: "400",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: height * 0.05,
    gap: width * 0.01,
  },
  accountText: {
    color: "#fff",
    fontFamily: "NacelleRegular",
    fontWeight: "400",
  },
  signupText: {
    color: "green",
    fontFamily: "NacelleBold",
    fontWeight: "700",
  },
});
