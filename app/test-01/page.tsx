"use client";

import { Button, Col, Row, Select } from "antd";
import { createStyles } from "antd-style";
import Title from "antd/es/typography/Title";
import React, { useState } from "react";

const useStyle = createStyles(({ css }) => ({
  div: css`
    width: 100vw;
    height: 100vh;
  `,
  button: css`
    width: 100%;
    height: 150px;
    position: relative;
    &::before {
      content: "Move Shape";
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      padding: 0px 15px;
      border-radius: 10px;
      color: white;
      font-size: 12px;
      font-weight: 700;
      background: rgb(110, 218, 120);
    }
  `,
  button2: css`
    width: 100%;
    height: 150px;
    justify-content: space-around;
    position: relative;
    &::before {
      content: "Move Position";
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      padding: 0px 15px;
      border-radius: 10px;
      color: white;
      font-size: 12px;
      font-weight: 700;
      background: rgb(110, 218, 120);
    }
  `,
  button3: css`
    width: 100%;
    height: 150px;
    position: relative;
  `,
  triangleUp: css`
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 100px solid #32557f;
  `,

  triangleDown: css`
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-top: 100px solid #32557f;
  `,

  triangleLeft: css`
    border-top: 50px solid transparent;
    border-right: 100px solid #32557f;
    border-bottom: 50px solid transparent;
  `,

  triangleRight: css`
    border-top: 50px solid transparent;
    border-left: 100px solid #32557f;
    border-bottom: 50px solid transparent;
  `,

  circle: css`
    background: #32557f;
    width: 100px;
    height: 100px;
    border-radius: 50%;
  `,

  ellipse: css`
    background: #32557f;
    width: 200px;
    height: 100px;
    border-radius: 50%;
  `,

  parallelogram: css`
    width: 200px;
    height: 100px;
    background: #32557f;
    transform: skew(20deg);
  `,

  trapezoid: css`
    height: 0;
    width: 150px;
    border-bottom: 100px solid #32557f;
    border-left: 40px solid transparent;
    border-right: 40px solid transparent;
  `,

  square: css`
    background: #32557f;
    width: 100px;
    height: 100px;
  `,

  rectangle: css`
    background: #32557f;
    width: 200px;
    height: 100px;
  `,
}));

const Page = () => {
  const { styles } = useStyle();
  const [position, setPosition] = useState(false);
  const [array, setArray] = useState<string[]>([
    styles.square,
    styles.circle,
    styles.ellipse,
    styles.trapezoid,
    styles.rectangle,
    styles.parallelogram,
  ]);

  function handleTranslate(value: string) {
    console.log(`selected ${value}`);
  }

  function handleLeft() {
    const newArray: string[] = [];
    // loop เอาค่าใน array มาใส่ใน newArray
    array.forEach((i) => newArray.push(i));
    // นำค่าแรกสุดออกมาใส่ต่อท้าย
    newArray.push(newArray.shift()!);

    setArray(newArray);
  }

  function handleRight() {
    const newArray: string[] = [];
    // loop เอาค่าใน array มาใส่ใน newArray
    array.forEach((i) => newArray.push(i));
    // นำค่าสุดท้ายออกมาใส่หน้าสุด
    newArray.unshift(newArray.pop()!)!;

    setArray(newArray);
  }

  function handlePosition() {
    setPosition(!position);
  }

  function handleRandom() {
    // Fisher-Yates Shuffle Algorithm
    const newArray: string[] = [];
    // loop เอาค่าใน array มาใส่ใน newArray
    array.forEach((i) => newArray.push(i));
    // ทำการสลับค่าในอาร์เรย์โดยวนลูปจากท้ายไปต้น
    for (let i = newArray.length - 1; i > 0; i--) {
      // สุ่มตำแหน่งระหว่าง 0 ถึง i
      const j = Math.floor(Math.random() * (i + 1));
      // สลับค่า array[i] กับ array[j]
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    setArray(newArray);
  }

  function loopButton() {
    return array.map((i, index) => (
      <Col
        span={6}
        key={index}
        offset={position ? (index === 3 ? 4 : 0) : index === 0 ? 4 : 0}
      >
        <Button className={styles.button3} onClick={() => handleRandom()}>
          <div className={i}></div>
        </Button>
      </Col>
    ));
  }

  return (
    <div className={styles.div}>
      <Row style={{ padding: 16 }} justify={"space-between"}>
        <Title level={2}>Layout & Style</Title>
        <Select
          defaultValue="en"
          style={{ width: 120 }}
          onChange={handleTranslate}
          options={[
            { value: "en", label: "EN" },
            { value: "th", label: "TH" },
          ]}
        ></Select>
      </Row>
      <Row justify={"center"}>
        <Col style={{ width: "70%" }}>
          <Row style={{ marginBottom: 48 }} gutter={12}>
            <Col span={6}>
              <Button
                size="large"
                className={styles.button}
                onClick={() => handleLeft()}
              >
                <div className={styles.triangleLeft}></div>
              </Button>
            </Col>
            <Col span={12}>
              <Button
                size="large"
                className={styles.button2}
                onClick={() => handlePosition()}
              >
                <div className={styles.triangleUp}></div>
                <div className={styles.triangleDown}></div>
              </Button>
            </Col>
            <Col span={6}>
              <Button
                size="large"
                className={styles.button}
                onClick={() => handleRight()}
              >
                <div className={styles.triangleRight}></div>
              </Button>
            </Col>
          </Row>
          <Row gutter={[12, 12]} justify={"center"}>
            {loopButton()}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Page;
