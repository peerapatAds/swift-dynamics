"use client";

import { Button, Flex, Space } from "antd";
import { createStyles } from "antd-style";
import { useRouter } from "next/navigation";
import React from "react";

const useStyle = createStyles(({ css }) => ({
  button: css`
    width: 250px;
    height: 100px;
  `,
}));

const Home = () => {
  const router = useRouter();
  const { styles } = useStyle();

  return (
    <Flex
      style={{ width: "100vw", height: "100vh" }}
      justify="center"
      align="center"
    >
      <Space>
        <Button
          className={styles.button}
          onClick={() => router.push("/test-01")}
        >
          Test 01
        </Button>
        <Button
          className={styles.button}
          onClick={() => router.push("/test-02")}
        >
          {" "}
          Test 02
        </Button>
      </Space>
    </Flex>
  );
};

export default Home;
