import React, { FC, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { View, ViewStyle, Image, StyleSheet, Modal, Text, TouchableOpacity, FlatList, ImageStyle } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackScreenProps, SCREEN, iNavigation } from "app/navigators";
import {
  AppBarComponent,
  Button,
  Screen,
  TextField,
  ConfirmationDetailsItem,
} from "app/components";
import style from "../../../theme/style";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { colors, image, spacing } from "app/theme";
import { useStores } from "app/models";
import { ZakatStateList } from "app/mockup/ZakatStateList";
import { FontAwesome5 } from "@expo/vector-icons";

type ZakatPhoneNumberScreenRouteParams = {
  selectedBody: string;
  selectedType: string;
};

interface ZakatPhoneNumberScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"ZakatPhoneNumber">> {}

export const ZakatPhoneNumberScreen: FC<ZakatPhoneNumberScreenProps> = observer(function ZakatPhoneNumberScreen({
  
}) {
  const navigation = useNavigation<iNavigation>();
  const [isBankModalVisible, setBankModalVisible] = useState(true);
  const [selectedBank, setSelectedBank] = useState("");

  const {
    zakat: {
      setSelectedBody,
      selectedBody,
      setSelectedType,
      selectedType,
      setZakatPhoneNumber,
      zakatPhoneNumber,
      setZakatAmount,
      zakatAmount,
      clearGlobalZakatDetails,
    },
  } = useStores();

  
 

  const ZakatAmountChange = (amount: string) => {
    const numericAmount = parseFloat(amount);
    setZakatPhoneNumber(isNaN(numericAmount) ? '0' : numericAmount.toString());
  };

  const toggleBankModal = () => {
    setBankModalVisible(!isBankModalVisible);
  };
  
  const handleBankSelection = (bankName: string) => {
    setSelectedBank(bankName);
    toggleBankModal();
  };

  let id = selectedBody;

  const displayLogo = (id) => {
    const zakat = ZakatStateList.find((zakat) => zakat.id === id);
    return zakat ? zakat.zakatLogo : "logo not found";
  };

  const displayName = (id) => {
    const zakat = ZakatStateList.find((zakat) => zakat.id === id);
    return zakat ? zakat.name : "name not found";
  };
  
  const [isPhoneNumberError, setPhoneNumberError] = useState(false);

  const handleAmountChange = (text: string) => {
    // Remove non-numeric characters except periods (.)
    const numericInput = text.replace(/[^0-9.]/g, "");
    setZakatPhoneNumber(numericInput); // Update the phoneNumber state with sanitized input

    if (text !== numericInput) {
      setPhoneNumberError(true); // Set the error state to true
    } else {
      //setError1("");
      setPhoneNumberError(false); // Set the error state to false when the input is valid
    }
  };
  
  const handleAmount = () => {
    if (!zakatPhoneNumber) {
      setPhoneNumberError(true); // Set the error state to true
    } else {
      //setError1("");
      setPhoneNumberError(false); 
      navigation.navigate(SCREEN.zakatAmount);
    }
  };

  return (
    <Screen style={$root} safeAreaEdges={["top", "bottom"]}>
      <AppBarComponent
        title={"Pay Zakat"}
        leadingIcon={"arrow-left"}
        leadingOnPress={() => navigation.dispatch(CommonActions.goBack())}
      />
      <View style={$container}>
          <View style={$contentContainer}>
            <View style={$zakatBodyLabel}>
              <Image
                source={image.zakatIllustration}
                style={$zakatBodyImage}
                resizeMode="contain"
              />
              <Text style={[$zakatBodyText, { fontSize: 20 }, { fontWeight: "bold" }]}>
                {selectedBody}
              </Text>
            </View>
          </View>

          <View style={$selectionContainer}>
            <Text style={[$selectionLabel, { fontSize: 20 }]}>Zakat Body:</Text>
            <Text style={[$selectedValue, { fontSize: 18 }]}>{selectedBody}</Text>
          </View>
          <View style={$selectionContainer}>
            <Text style={[$selectionLabel, { fontSize: 20 }]}>Zakat Type:</Text>
            <Text style={[$selectedValue, { fontSize: 18 }]}>{selectedType}</Text>
          </View>
        </View>
      <View style={$inputAmountContainer}>
        <TextField
          label={"   Enter Your Phone Number"}

          placeholder={"Phone Number"}
          keyboardType={"numeric"}
          returnKeyType={"done"}
          autoFocus={true}
          onChangeText={(text) => handleAmountChange(text)}
          LeftAccessory={leftTextFieldAccessory}
          inputWrapperStyle={{ borderRadius: 20 }}

          value={zakatPhoneNumber} // Add this line
        />

        {isPhoneNumberError && (
          <View style={{ paddingLeft: 8 }}>
            <FontAwesome5 name="exclamation-triangle" size={20} color="red" />
          </View>
        )}
      </View>
      {isPhoneNumberError && <Text style={{ color: "red" }}>Please enter a valid phone number</Text>}
      <View style={$bottomContainer}>
        <Button
          text={"Next"}
          onPress={handleAmount}
        />
      </View>
    </Screen>
  )
})

const leftTextFieldAccessory = () => {
  let $container: ViewStyle = {
    marginTop: spacing.sm - 1,
    marginLeft: spacing.md,
  }

  return (
    <Text style={[$container, { fontSize: 15 }, { fontWeight: "bold" }]}>
      + 60
    </Text>
  )
}



const $content: ViewStyle = {
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  marginTop: spacing.lg,
  paddingLeft: spacing.lg,
}

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
})




const $root: ViewStyle = {
  ...style.root,
  flex: 1,
  position: "relative",
}

const $inputAmountContainer: ViewStyle = { marginTop: spacing.xl }

const $bottomContainer: ViewStyle = {
  ...style.bottomContainer20,
}

const $container: ViewStyle = {
  marginTop: spacing.lg,
  borderRadius: 5,
}





const $selectionContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 30,
  marginLeft: 30,
}

const $selectionLabel: ViewStyle = {
  marginRight: 20,
  marginLeft: -17,
}

const $selectedValue: ViewStyle = {
  marginRight: 20,
  marginLeft: -10
}


const $contentContainer: ViewStyle = {
  padding: 10,
}
const $zakatBodyLabel: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 30,
  marginRight: 100,
}

const $zakatBodyImage: ImageStyle = {
  width: 60,
  height: 60,
  marginRight: 30,
  marginLeft: 35,
  marginTop: 10,
}

const $zakatBodyText: ViewStyle = {
  marginRight: 20,
  marginLeft: 60,
  marginTop: 30,
}