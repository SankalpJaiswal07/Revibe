import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import React, { useState } from "react";

import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useNavigation } from "@react-navigation/native";
import { signUp } from "../services/supabase";
import { useGlobalContext } from "../util/GlobalContext";
import CustomLoader from "../components/CustomLoader";
import AntDesign from "@expo/vector-icons/AntDesign";

const { width, height } = Dimensions.get("window");

const SignupScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [secureEntery, setSecureEntery] = useState(true);
  const { updateProfileSetupRequired } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleSignUp = async () => {
    setErrorMessage("");
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      await signUp(email, password);
      updateProfileSetupRequired(true);
    } catch (error) {
      if (error.message == "User already registered") {
        setErrorMessage(error.message);
      } else if (error.message == "Password should be at least 6 characters.") {
        setErrorMessage(error.message);
      } else if (
        error.message == "Unable to validate email address: invalid format"
      ) {
        setErrorMessage("Invalid Email: Please enter valid email");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <CustomLoader loadingText="Getting things ready for you..." />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.illustrationContainer}>
        <Image
          source={require("../assets/illustration/signup.png")}
          style={styles.illustration}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Let’s Get Started!</Text>
        <Text style={styles.subtitle}>Create Your Account</Text>
      </View>
      {/* form  */}
      <View style={styles.formContainer}>
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}
        <View style={styles.inputContainer}>
          <Ionicons name={"mail-outline"} size={30} color={"#fff"} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            placeholderTextColor={"#fff"}
            keyboardType="email-address"
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <SimpleLineIcons name={"lock"} size={30} color={"#fff"} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your password"
            placeholderTextColor={"#fff"}
            secureTextEntry={secureEntery}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => {
              setSecureEntery((prev) => !prev);
            }}
          >
            <SimpleLineIcons name={"eye"} size={20} color={"#fff"} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.loginButtonWrapper}
          onPress={handleSignUp}
        >
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Sign up</Text>
            <AntDesign name="login" size={24} color="white" />
          </View>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.accountText}>Already have an account!</Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.signupText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignupScreen;

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
    flex: 1,
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.05,
  },
  errorMessage: {
    color: "red",
    fontSize: width * 0.035,
    marginBottom: height * 0.01,
    textAlign: "center",
    fontFamily: "NacelleRegular",
    fontWeight: "400",
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
  textInput: {
    flex: 1,
    paddingHorizontal: width * 0.03,
    color: "#fff",
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
    textAlign: "center",
    fontSize: width * 0.05,
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
    marginVertical: height * 0.04,
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
