import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  FlatList,
  Image,
  ImageStyle,
  Pressable,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native"
import { CommonActions, useNavigation } from "@react-navigation/native"
import { colors, image, spacing } from "app/theme"
import style from "app/theme/style"
import { AppBarComponent, Icon, Screen, Text } from "app/components"
import { BillList } from "app/mockup/BillList"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps, iNavigation, SCREEN } from "app/navigators"
import { iBillList } from "app/utils/interfaces/bill.interface"
import { useStores } from "app/models"
import { SceneMap, TabView } from "react-native-tab-view"
import { PayBillFavoriteBillTab } from "./PayBillFavoriteBillTabRoute"
import { PayBillFavoriteTabJomPay } from "./PayBillFavoriteTabJomPayRoute"
import { PayBillFavoriteTabZakat } from "./PayBillFavoriteTabZakatRoute"
import { renderTabBar } from "app/components/renderTabBar"

interface PayBillScreenProps extends NativeStackScreenProps<AppStackScreenProps<"PayBill">> {}

interface PaymentOption {
  id: string
  title: string
  logo: any
  onPress: () => void
}
//pull in one of our MST stores

export const PayBillScreen: FC<PayBillScreenProps> = observer(function PayBillScreen() {
  const navigation = useNavigation<iNavigation>()

  const {
    payBills: { setBillDetails },
  } = useStores()

  const paymentOptions = [
    {
      id: "1",
      title: "JomPay",
      logo: image.jomPay_logo,
      onPress: () => navigation.navigate(SCREEN.jomPayInputDetails),
    },

    {
      id: "2",
      title: "Pay Bill",
      logo: image.bill,
      onPress: () => navigation.navigate(SCREEN.payBillSearchBill),
    },

    {
      id: "3",
      title: "Zakat",
      logo: image.zakat3,
      onPress: () => navigation.navigate(SCREEN.zakatMain),
    },
  ]

  const handleBillPress = (bill: iBillList) => {
    navigation.navigate(SCREEN.payBillInputRecipientAccountNo)
    setBillDetails(bill.id)
  }

  const renderPaymentOption = (item: PaymentOption) => {
    return (
      <View style={$paymentOptionStyle}>
        <Image source={item.logo} style={$paymentOptionLogo} />
        <Text style={$paymentOptionTitle}>{item.title}</Text>
      </View>
    )
  }

  const popularBillsRows = []
  for (let i = 0; i < BillList.length; i += 4) {
    popularBillsRows.push(BillList.slice(i, i + 4))
  }

  //tab display in favorite bills
  const layout = useWindowDimensions()

  const TabScenes = SceneMap({
    first: PayBillFavoriteBillTab,
    second: PayBillFavoriteTabJomPay,
    third: PayBillFavoriteTabZakat,
  })

  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const tabRoutes = [
    { key: "first", title: "Bill" },
    { key: "second", title: "JomPay" },
    { key: "third", title: "Zakat" },
  ]

  return (
    <Screen style={$root} safeAreaEdges={["top", "bottom"]}>
      <AppBarComponent
        title={"Pay Bill"}
        leadingIcon={"arrow-left"}
        leadingOnPress={() => navigation.dispatch(CommonActions.goBack())}
      />

      {/* Popular Bills Section*/}
      <View style={$sectionContainer}>
        <View style={$subheadingContainer}>
          <Text text="Popular Bills" preset="subheading" />
          <TouchableOpacity onPress={() => navigation.navigate(SCREEN.payBillSearchBill)}>
            <Text style={$showMoreText}>Show More</Text>
          </TouchableOpacity>
        </View>
        <View style={{ margin: spacing.sm }} />

        {popularBillsRows.map((row, rowIndex) => (
          <View key={rowIndex} style={$popularBillsRow}>
            {row.map((bill: iBillList) => (
              <TouchableOpacity
                key={bill.id}
                onPress={() => handleBillPress(bill)}
                style={$billButtonContent}
              >
                <Image style={$billButtonImage} source={bill.billLogo} />
                <Text style={$billButtonText}>{bill.billName}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {/* New Payment Section*/}
      <View style={$sectionContainer}>
        <Text text="New Payment" preset="subheading" />
        <FlatList
          data={paymentOptions}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                console.debug("Go to", item.title + "'s" + " screen")
                item.onPress()
              }}
            >
              {renderPaymentOption(item)}
            </Pressable>
          )}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          keyExtractor={(item) => item.id}
          style={{ marginTop: spacing.xxs }}
        />
      </View>

      {/* Saved Bills Section */}
      <View style={$sectionContainer}>
        <Text text="Favorite Bills" preset="subheading" />
      </View>

      <View style={$mainContainer}>
        <TabView
          navigationState={{ index: activeTabIndex, routes: tabRoutes }}
          renderScene={TabScenes}
          onIndexChange={setActiveTabIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={(props) => renderTabBar({ ...props, scrollEnabled: false })}
        />
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  ...style.root,
  flex: 1,
  position: "relative",
}

const $sectionContainer: ViewStyle = {
  marginTop: spacing.lg,
}

const $subheadingContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}

const $showMoreText: TextStyle = {
  color: "blue",
  fontSize: 13,
}

const $popularBillsRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: spacing.sm,
}

const $billButtonContent: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

const $billButtonImage: ImageStyle = {
  width: 50,
  height: 50,
  resizeMode: "contain",
}

const $billButtonText: TextStyle = {
  textAlign: "center",
  fontSize: 13,
}

const $paymentOptionStyle: ViewStyle = {
  height: 110,
  width: 80,
  borderRadius: 10,
  marginRight: spacing.md,
  marginVertical: spacing.lg,
  backgroundColor: colors.palette.neutral100,
  ...style.shadow,
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.xs,
  justifyContent: "space-around",
  alignItems: "center",
}

const $paymentOptionLogo: ImageStyle = {
  height: 40,
  marginBottom: spacing.xxs,
  width: 44,
}

const $paymentOptionTitle: TextStyle = {
  fontSize: 12,
  lineHeight: 14,
  textAlign: "center",
}

const $mainContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "97%",
}
