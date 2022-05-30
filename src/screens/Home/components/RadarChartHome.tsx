import React, { memo, useCallback, useEffect, useMemo } from "react";
import { RadarChart } from "react-native-charts-wrapper";
import { processColor, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/themes/Colors";
import { RawStat } from "@/store/auth/types";
import { styled } from "@/global";
import { Fonts } from "@/assets/fonts";
import moment from "moment";

export const RadarChartHome = memo(function RadarChartHome({
  stat,
}: {
  stat: RawStat;
}) {
  const valueChart = useMemo(() => {
    const output = Object.entries(stat || {}).map(([key, data]) => ({
      value: data,
    }));
    return output;
  }, [stat]);

  const data = useMemo(() => {
    return {
      dataSets: [
        {
          values: valueChart,
          label: "DS 1",
          config: {
            color: processColor(Colors.red1),
            drawFilled: true,
            fillColor: processColor(Colors.red1),
            valueTextColor: processColor("transparent"),
            fillAlpha: 1000,
            lineWidth: 2,
          },
        },
      ],
    };
  }, [stat]);

  const xAxis = useMemo(() => {
    return {
      valueFormatter: [
        "Sức bền",
        "Chăm chỉ",
        "Đòn đánh",
        "Phản xạ",
        "Sức mạnh",
      ],
      textColor: processColor(Colors.colorText),
    };
  }, []);

  const legend = useMemo(() => {
    return {
      enabled: false,
      textSize: 14,
      drawInside: false,
      wordWrapEnabled: false,
    };
  }, []);

  return (
    <View style={styles.container}>
      <RadarChart
        style={styles.chart}
        data={data || undefined}
        xAxis={xAxis}
        yAxis={{ drawLabels: false }}
        chartDescription={{ text: "" }}
        legend={legend}
        drawWeb={true}
        webLineWidth={0.5}
        webLineWidthInner={0.5}
        webAlpha={255}
        webColor={processColor(Colors.colorText)}
        webColorInner={processColor(Colors.colorText)}
        skipWebLineCount={1}
        onChange={(event) => console.log(event.nativeEvent)}
      />
      <SText>{moment().format("DD/MM/YYYY")}</SText>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: 180,
    width: 180,
  },
  chart: {
    flex: 1,
  },
});

const SText = styled.Text`
  color: ${Colors.grey5};
  font-family: ${Fonts.metrophobic};
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  position: absolute;
  bottom: 4px;
  left: 50px;
`;

export default RadarChartHome;
