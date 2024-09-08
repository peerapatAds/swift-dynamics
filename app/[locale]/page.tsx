"use client";

import { Button, Col, Flex, Row, Select, Space } from "antd";
import { createStyles } from "antd-style";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";

const useStyle = createStyles(({ css }) => ({
  button: css`
    width: 250px;
    height: 100px;
  `,
}));

type Props = {
  params: { locale: string };
};

const Home = ({ params: { locale } }: Props) => {
  const router = useRouter();
  const { styles } = useStyle();
  const t = useTranslations("HomePage");
  const tc = useTranslations("Common");

  function handleTranslate(value: string) {
    router.replace(`/${value}/`);
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Row style={{ padding: 16 }} justify={"end"}>
        <Col>
          <Space>
            <Select
              defaultValue={locale}
              style={{ width: 120 }}
              onChange={handleTranslate}
              options={[
                { value: "en", label: tc("en") },
                { value: "th", label: tc("th") },
              ]}
            ></Select>
          </Space>
        </Col>
      </Row>
      <Row style={{ height: "90vh" }} justify="center" align="middle">
        <Space>
          <Button
            className={styles.button}
            onClick={() => router.push(`/${locale}/test-01`)}
          >
            {t("test01")}
          </Button>
          <Button
            className={styles.button}
            onClick={() => router.push(`/${locale}/test-02`)}
          >
            {t("test02")}
          </Button>
        </Space>
      </Row>
    </div>
  );
};

export default Home;
