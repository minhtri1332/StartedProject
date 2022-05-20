import React, { memo, useCallback, useEffect, useState } from "react";
import { HeaderHome } from "@/componens/Header/DynamicHeader";
import { ScreenWrapper } from "@/common/CommonStyles";
import { IMG_TARGET_HOME_THEME } from "@/assets";
import { styled, useAsyncFn, useBoolean } from "@/global";
import RadarChartHome from "@/screens/Home/components/RadarChartHome";
import { RefreshControl, ScrollView, View } from "react-native";
import PunchComponent from "@/screens/Home/HitScreen/PunchComponent";
import PowerComponent from "@/screens/Home/StrengthScreen/PowerComponent";
import {
  RawDataGoal,
  RawDataStrengthGoal,
  requestHitGoal,
  requestStrengthGoal,
} from "@/store/home/function";
import { Colors } from "@/themes/Colors";
import GradientButton from "@/componens/Gradient/ButtonGradient";
import PracticingBottomModal from "@/screens/Home/PracticingBottomModal/PracticingBottomModal";
import PracticeComponent from "@/screens/Home/PracticeScreen/PracticeComponent";
import useAutoToastError from "@/hooks/useAutoToastError";
import { requestGetProfile } from "@/store/profile/functions";
import LocalStorageHelper from "@/services/LocalServiceHelper";
import MachineIdService from "@/services/MachineIdService";
import RatingsComponent from "@/screens/Home/RatingsScreen/RatingsComponent";

export const HomeScreen = memo(function HomeScreen({ navigation }: any) {
  const [listMachineId, setListMachineId] = useState("");
  const [isModalPracticeVisible, showModalPractice, hideModalPractice] =
    useBoolean();
  const [stat, setStat] = useState();
  const [dataHit, setDataHit] = useState<RawDataGoal>({
    goal: 0,
    total_hits: 0,
  });
  const [dataStrength, setDataStrength] = useState<RawDataStrengthGoal>({
    strength: 0,
    strength_goal: 0,
    list_point: [],
  });

  const [{ loading }, onLoadData] = useAsyncFn(async () => {
    getdata();
    const dataHit = await requestHitGoal();
    setDataHit(dataHit);
    const dataStrength = await requestStrengthGoal();
    setDataStrength(dataStrength);
  }, []);

  const [{ loading: l, error }, getdata] = useAsyncFn(async () => {
    const profile = await requestGetProfile();
    setStat(profile.stat);
  }, []);

  const getDataMachine = useCallback(async () => {
    LocalStorageHelper.get("machine").then((item) => {
      // const dataLocal = (item || "").split(",");
      // setListMachineId(dataLocal || []);
      MachineIdService.change(item || "");
    });
  }, []);

  useAutoToastError(error);

  useEffect(() => {
    onLoadData().then();
    getDataMachine().then();
  }, []);

  return (
    <ScreenWrapper>
      <HeaderHome title={"Home"} toggleDrawer={navigation.toggleDrawer} />
      <ScrollView
        refreshControl={
          <RefreshControl
            progressBackgroundColor={Colors.colorText}
            tintColor={Colors.colorText}
            refreshing={loading}
            onRefresh={onLoadData}
          />
        }
      >
        <View style={{ flexDirection: "row" }}>
          <SImageBackground
            resizeMode={"contain"}
            source={IMG_TARGET_HOME_THEME}
          />
          <View style={{ flex: 1 }}>
            {stat && <RadarChartHome stat={stat} />}
          </View>
          <SBaseOpacityButton>
            <GradientButton label={"Tập luyện"} onPress={showModalPractice} />
          </SBaseOpacityButton>
        </View>

        <PunchComponent dataHit={dataHit} />
        <PowerComponent dataStrength={dataStrength} />
        <RatingsComponent />

        <PracticeComponent />
      </ScrollView>
      <PracticingBottomModal
        isVisible={isModalPracticeVisible}
        hideMenu={hideModalPractice}
        listMachineId={listMachineId}
      />
    </ScreenWrapper>
  );
});

export default HomeScreen;

const SImageBackground = styled.Image`
  height: 180px;
  width: 100%;
  position: absolute;
`;

const SBaseOpacityButton = styled.View`
  padding: 0 16px;
  align-self: center;
`;
