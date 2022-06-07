import React, { memo, useEffect, useMemo, useState } from "react";
import { styled } from "@/global";
import { Colors } from "@/themes/Colors";
import { Stopwatch } from "react-native-stopwatch-timer";
import _ from "lodash";

export interface practiceProps {
  practice: any;
  dataMapTime: any[];
  replay: boolean;
}

const PointHitComponent = memo(function PointHitComponent({
  practice,
  dataMapTime,
  replay,
}: practiceProps) {
  const [dt, setDt] = useState(0.0);
  const pointObject = useMemo(() => {
    if (dt == 0) return { point: 0, position: 0 };
    const key = String(dt).split(":");
    const data = key[0] + ":" + key[1] + ":" + key[2] + "." + key[3].slice(1);
    // @ts-ignore
    const actionCurrent = dataMapTime[data];

    return { point: actionCurrent?.f, position: actionCurrent?.p };
  }, [dt, dataMapTime]);

  useEffect(() => {
    // if (practice?.end_time / 10000 > dt) {
    // let secTimer = setInterval(async () => {
    //   setDt(dt + 10);
    // }, 10);
    //
    // return () => clearInterval(secTimer);
    // }
  }, [dt, practice?.end_time]);

  useEffect(() => {
    setDt(0);
  }, [replay, setDt, practice]);

  const position1 = useMemo(() => {
    return (
      <ItemHitPoint
        point={pointObject.point}
        position={pointObject.position == 1}
      />
    );
  }, [pointObject?.position]);

  return (
    <SViewContainerHitPoint>
      <ItemHitPoint
        point={pointObject.point}
        position={pointObject.position == 1}
      />
      <SViewHitPointLeftRight>
        <ItemHitPoint
          point={pointObject.point}
          position={pointObject.position == 2}
          isPaddingLeft={"left"}
        />
        <ItemHitPoint
          point={pointObject.point}
          position={pointObject.position == 3}
        />
      </SViewHitPointLeftRight>
      <ItemHitPoint
        point={pointObject.point}
        position={pointObject.position == 4}
      />
      <Stopwatch
        laps
        msecs
        start={true}
        reset={false}
        options={{}}
        getTime={setDt}
      />
    </SViewContainerHitPoint>
  );
});

export default PointHitComponent;

const SViewHitPoint = styled.View<{ isHighLight: boolean }>`
  height: 40px;
  width: 40px;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.isHighLight ? Colors.orange1 : Colors.red1 + "20"};
  border-color: darkred;
  border-width: 1px;
`;

const SViewHitPointLeft = styled(SViewHitPoint)`
  margin-right: 100px;
`;

const SViewHitPointLeftRight = styled.View`
  flex-direction: row;
`;

const SViewContainerHitPoint = styled.View`
  height: 150px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 140px;
  right: 10px;
`;

const STextHitPoint = styled.Text`
  font-family: Roboto-Medium;
  font-size: 13px;
  color: ${Colors.red1};
`;

export const ItemHitPoint = memo(function ItemHitPoint({
  point,
  position,
  isPaddingLeft,
}: {
  point: any;
  position: boolean;
  isPaddingLeft?: string;
}) {
  const [currentPoint, setCurrentPoint] = useState(0);

  const showToast = useMemo(
    () =>
      _.debounce(() => {
        setCurrentPoint(0);
      }, 1000),
    [point, position]
  );

  useEffect(() => {
    if (position) {
      setCurrentPoint(point);
    }

    showToast();
  }, [point, position]);

  if (isPaddingLeft !== "left") {
    return (
      <SViewHitPoint isHighLight={currentPoint != 0}>
        <STextHitPoint>{currentPoint || ""}</STextHitPoint>
      </SViewHitPoint>
    );
  }
  return (
    <>
      <SViewHitPointLeft isHighLight={currentPoint != 0}>
        <STextHitPoint>{currentPoint || ""}</STextHitPoint>
      </SViewHitPointLeft>
    </>
  );
});
