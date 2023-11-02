import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Text,
  ViewStyle,
  ImageStyle,
  Alert,
  Button,
} from "react-native"
import style from "../../../theme/style"
import { useNavigation } from "@react-navigation/native"
import { AppBarComponent, Screen, SelectField } from "app/components"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { colors, typography, spacing, image, height } from "app/theme"
import DropDownPicker from "react-native-dropdown-picker"
import { AppStackScreenProps, iNavigation } from "app/navigators"
import { useStores } from "app/models"
import { zakatAPI, zakatInItResponse } from "app/services/api"
import { fetchZakatInIt } from "app/utils/helpers/authUtils"
import AsyncStorage from '@react-native-async-storage/async-storage';


interface ZakatMainScreenProps extends NativeStackScreenProps<AppStackScreenProps<"ZakatMain">> {}

export const ZakatMainScreen: FC<ZakatMainScreenProps> = observer(function ZakatMainScreen() {
  const navigation = useNavigation<iNavigation>()

  const {
    zakat: {
      setSelectedBody,
      selectedBody,
      setSelectedType,
      selectedType,
      clearGlobalZakatDetails,
    },
  } = useStores()
  const [zakatBody, setZakatBody] = useState([])
  const [zakatType, setZakatType] = useState([])
  
  const [isBodyModalVisible, setIsBodyModalVisible] = useState(false)
  const [isTypeModalVisible, setIsTypeModalVisible] = useState(false)
  const [test, setTest] = useState("")
  
  const testButton = async () => {
    try {
      const t: zakatInItResponse = await zakatAPI.getZakatInIt(
        "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJMT0dJTiIsImV4cCI6MTY5ODg5NTc3MCwiaXNzIjoicGVucmlsLm1vYmlsZWJhbmtpbmcuY29tIiwidXNlcm5hbWUiOiJpZmZhaCJ9.HgZYZRuPpqhPNFwOEjJ6_kPcqz9XNW0cjRU1ygYBjbTQOz5Gu4a94MBKZ-FRphZCoi0i4i6JX0nWu7-CFVQG7g"
      )
      setZakatBody(t.zakatBody)
      setZakatType(t.zakatType)
      console.log("t.zakatBody:" + JSON.stringify(t.zakatBody))
      Alert.alert("alert", t.zakatBody[0], [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ])
    } catch (error) {
      console.log("G1")
      console.log("error" + JSON.stringify(error))
    }
  }
  

  const goBack = () => {
    navigation.goBack()
  }

  const toggleBodyModal = () => {
    setIsBodyModalVisible(!isBodyModalVisible)
  }

  const toggleTypeModal = () => {
    setIsTypeModalVisible(!isTypeModalVisible)
  }

  const isNextButtonDisabled = !selectedBody || !selectedType

  const bodyItems = zakatBody.map((body) => ({
    label: body,
    value: body,
  }))

  const typeItems = zakatType.map((type) => ({
    label: type,
    value: type,
  }))

  return (
    <Screen style={$root} safeAreaEdges={["top", "bottom"]}>
      <AppBarComponent title={"Pay Zakat"} leadingIcon={"arrow-left"} leadingOnPress={goBack} />
      <View style={$mainContainer}>
        <View style={$contentContainer}>
          <View style={$zakatBodyLabel}>
            <Text style={[$zakatBodyText, { fontSize: 30 }, { fontWeight: "bold" }]}>ZAKAT</Text>

            <Image source={image.zakatIllustration} style={$zakatBodyImage} resizeMode="contain" />
          </View>

          <View style={$topContainer}>
            <SelectField
              label="Zakat Body"
              placeholder="Select an option"
              value={[selectedBody]}

              onSelect={(selectedBody) => {
                setSelectedBody(selectedBody[0])
                //fetchZakatInIt(selectedBody[0])
              }}
              options={bodyItems}
              multiple={false}
              //   containerStyle={{ marginBottom: spacing.xl }}
            />
          </View>

          <View style={$topContainer}>
            <SelectField
              label="Zakat Type"
              placeholder="Select an option"
              value={[selectedType]}
              onSelect={(selectedType) => {
                setSelectedType(selectedType[0])
              }}
              options={typeItems}
              multiple={false}
              //   containerStyle={{ marginBottom: spacing.xl }}
            />
          </View>
        </View>

        <View style={$bottomContainer}>
          <Button
            title="Test API"
            onPress={testButton}
          />
          <TouchableOpacity
            style={[$nextButton]}
            onPress={async () => {
              if (!isNextButtonDisabled) {
                console.log("Selected Zakat Body:", selectedBody)
                console.log("Selected Zakat Type:", selectedType)

                await setSelectedBody(selectedBody)
                await setSelectedType(selectedType)
                await testButton();
                //fetchZakatInIt (selectedBody)
                navigation.navigate("ZakatPhoneNumber", {})
              }
            }}
            disabled={isNextButtonDisabled}
          >
            <Text
              style={[
                $nextButtonText,
                { fontSize: 17 },
                { fontWeight: "bold" },
                { color: "white" },
              ]}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  ...style.root,
}

const $mainContainer: ViewStyle = {
  ...style.root,
}

const $contentContainer: ViewStyle = {
  padding: 16,
}

const $zakatBodyLabel: ViewStyle = {
  flexDirection: "row",
  alignItems: "flex-start", // Fixed: Changed alignItems to flex-start to avoid text being squeezed together
  justifyContent: "flex-end",
  marginBottom: 10,
}

const $zakatBodyImage: ImageStyle = {
  width: 100,
  height: 100,
  marginLeft: 1, // Fixed: Removed marginLeft to avoid image overlapping with text
  marginRight: 5,
}

const $zakatBodyText: ViewStyle = {
  marginRight: 100,
  marginTop: 50,
}

const $topContainer: ViewStyle = {
  marginTop: spacing.xxl,
}

const $bottomContainer: ViewStyle = {
  alignItems: "center",
  marginTop: 80,
  ...style.bottomContainer20,
}

const $nextButton: ViewStyle = {
  backgroundColor: colors.primary,
  borderRadius: 40,
  paddingVertical: 10,
  paddingHorizontal: 140,
}

const $nextButtonText: ViewStyle = {
  alignItems: "center",
  marginTop: spacing.xs,
}
