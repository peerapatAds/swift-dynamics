"use client";

import {
  dataList,
  deleteFormById,
  deleteFormBySelect,
  formAdd,
  formGetById,
  formUpdateById,
  selectedData,
  setFormByLocalStore,
} from "@/lib/features/form/formSlice";
import {
  Row,
  Col,
  Space,
  Select,
  Button,
  Form,
  FormProps,
  Input,
  DatePicker,
  Radio,
  Typography,
  Table,
  Checkbox,
} from "antd";
import { createStyles } from "antd-style";
import Title from "antd/es/typography/Title";
import { useRouter } from "next/navigation";
const { Text } = Typography;
import dayjs from "dayjs";

import React, { Key, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";

const useStyle = createStyles(({ css }) => ({
  div: css`
    width: 100vw;
    height: 100vh;
  `,
}));

type FieldType = {
  id: string;
  title: string;
  firstname: string;
  lastname: string;
  birthday: string;
  nationality: string;
  citizenId?: string;
  gender: string;
  mobilePhone: string;
  passportNo?: string;
  expectedSalary: string;
  prefix?: string;
};

type Props = {
  params: { locale: string };
};

const Page = ({ params: { locale } }: Props) => {
  const { styles } = useStyle();
  const router = useRouter();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const t = useTranslations("Test02");
  const tc = useTranslations("Common");
  const [citizenId, setCitizenId] = useState(["", "", "", "", ""]);
  const [prefix, setPrefix] = useState("");
  const selectDataStore = useSelector(selectedData);
  const dataListStore = useSelector(dataList);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  useEffect(() => {
    setDataList();
  }, [dispatch]);

  useEffect(() => {
    setFormById(selectDataStore);
  }, [selectDataStore]);

  function handleTranslate(value: string) {
    router.replace(`/${value}/test-02`);
  }

  const setDataList = () => {
    // ดึงข้อมูลจาก LocalStorage
    const localDataList = localStorage.getItem("dataList");

    // ถ้ามีข้อมูลอยู่ใน LocalStorage ให้นำข้อมูลนั้นเข้า Redux store
    if (localDataList) {
      const parsedData = JSON.parse(localDataList); // แปลงจาก string เป็น object
      dispatch(setFormByLocalStore(parsedData)); // เพิ่มข้อมูลลงใน Redux store
    }
  };

  function setFormById(params: FieldType) {
    if (params && params.citizenId) {
      // นำค่าที่รวมแล้วมาแยกเป็นอาร์เรย์อีกครั้ง
      const newCitizenId: string[] = [];
      for (let index = 0; index < 5; index++) {
        let sliceCitizenId = "";
        switch (index) {
          case 0:
            sliceCitizenId = params.citizenId.slice(0, 1);
            break;
          case 1:
            sliceCitizenId = params.citizenId.slice(1, 5);
            break;
          case 2:
            sliceCitizenId = params.citizenId.slice(5, 10);
            break;
          case 3:
            sliceCitizenId = params.citizenId.slice(10, 12);
            break;
          case 4:
            sliceCitizenId = params.citizenId.slice(12);
            break;
        }
        newCitizenId.push(sliceCitizenId);
      }
      setCitizenId(newCitizenId); // อัปเดตค่าที่แยกกลับลงใน state
      const sliceMobilePhone = selectDataStore["mobilePhone"].slice(3);
      const slicePrefix = selectDataStore["mobilePhone"].slice(0, 3);
      setPrefix(slicePrefix);
      // ตั้งค่าฟอร์มด้วยข้อมูลจาก Redux เมื่อ component โหลด
      form.setFieldsValue({
        ...selectDataStore,
        mobilePhone: sliceMobilePhone,
      });
    }
  }

  const onEdit = (id: string) => {
    if (selectedRowKeys.length > 1) return;
    dispatch(formGetById(id));
  };

  const onDelete = (id?: string) => {
    if (id && selectedRowKeys.length <= 1) {
      dispatch(deleteFormById(id));
      alert(t("deleteSuccess"));
    }
    if (!id && selectedRowKeys.length) {
      dispatch(deleteFormBySelect(selectedRowKeys));
      alert(t("deleteSuccess"));
    }
  };

  const onReset = () => {
    form.resetFields();
    setCitizenId(["", "", "", "", ""]);
    setPrefix("");
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
    // นำผลลัพธ์ของ Birthday มา format เป็น YYYY-MM-DD
    const newDate = dayjs(values["birthday"]).format("YYYY-MM-DD");
    // นำผลลัพธ์ของ CitizenID มารวมกัน
    const fullCitizenId = citizenId.join("");
    // นำผลลัพธ์ของ Prefix และ MobilePhone มารวมกัน
    const fullMobilePhone = prefix.concat(values["mobilePhone"]!);
    if (selectDataStore.id) {
      dispatch(
        formUpdateById({
          ...values,
          id: selectDataStore.id,
          birthday: newDate,
          citizenId: fullCitizenId,
          mobilePhone: fullMobilePhone,
        })
      );
      alert(t("saveSuccess"));
    } else {
      dispatch(
        formAdd({
          ...values,
          birthday: newDate,
          citizenId: fullCitizenId,
          mobilePhone: fullMobilePhone,
        })
      );
      alert(t("saveSuccess"));
    }
    onReset();
    setDataList();
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const handleCitizenID = (value: string, index: number, maxLength: number) => {
    const newCitizenId = [...citizenId];
    newCitizenId[index] = value;

    // อัปเดตค่าลงใน state
    setCitizenId(newCitizenId);

    // ย้ายไปช่องถัดไปเมื่อใส่ครบ
    if (value.length === maxLength && index < 4) {
      const nextInput = document.getElementById(`citizen-id-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handlePrefix = (value: string) => {
    setPrefix(value);
  };

  const columns = [
    {
      title: t("name"),
      render: (_: FieldType, record: FieldType) => (
        <Space size="middle">
          <Text>{record.title === "mr" ? t("mr") : t("ms")}</Text>
          <Text>{record.firstname}</Text>
          <Text>{record.lastname}</Text>
        </Space>
      ),
    },
    {
      title: t("gender"),
      render: (_: FieldType, record: FieldType) => (
        <Space size="middle">
          <Text>
            {record.gender === "male"
              ? t("male")
              : record.gender === "female"
              ? t("female")
              : t("unisex")}
          </Text>
        </Space>
      ),
    },
    {
      title: t("mobilePhone"),
      dataIndex: "mobilePhone",
    },
    {
      title: t("nationality"),
      render: (_: FieldType, record: FieldType) => (
        <Space size="middle">
          <Text>
            {record.nationality === "thai" ? t("thai") : t("myanmar")}
          </Text>
        </Space>
      ),
    },
    {
      title: t("manage"),
      render: (_: FieldType, record: FieldType) => (
        <Space size="middle">
          <Button type="text" onClick={() => onEdit(record.id)}>
            {t("edit")}
          </Button>
          <Button type="text" onClick={() => onDelete(record.id)}>
            {t("delete")}
          </Button>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: Key[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const onSelectAll = (checked: boolean) => {
    if (checked) {
      // เลือกทั้งหมดเมื่อคลิกที่ checkbox
      const allRowKeys = dataListStore.map((item) => item.id);
      setSelectedRowKeys(allRowKeys);
    } else {
      // ยกเลิกการเลือกทั้งหมด
      setSelectedRowKeys([]);
    }
  };

  return (
    <div className={styles.div}>
      <Row style={{ padding: 16 }} justify={"space-between"}>
        <Title level={2}>{t("title")}</Title>
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
            <Button onClick={() => router.push(`/${locale}/`)}>
              {tc("home")}
            </Button>
          </Space>
        </Col>
      </Row>
      <Row justify={"center"}>
        <Col
          style={{ border: "1px solid #000", borderRadius: 10, padding: 16 }}
          span={17}
        >
          <Form
            name="basic"
            form={form}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Row id="row1" gutter={16}>
              <Col span={5}>
                <Form.Item<FieldType>
                  label={t("titleName")}
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: `${t("pleaseInput")} ${t("titleName")}!`,
                    },
                  ]}
                >
                  <Select
                    placeholder={t("titleName")}
                    options={[
                      { value: "mr", label: t("mr") },
                      { value: "ms", label: t("ms") },
                    ]}
                  ></Select>
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item<FieldType>
                  label={t("firstname")}
                  name="firstname"
                  rules={[
                    {
                      required: true,
                      message: `${t("pleaseInput")} ${t("firstname")}!`,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item<FieldType>
                  label={t("lastname")}
                  name="lastname"
                  rules={[
                    {
                      required: true,
                      message: `${t("pleaseInput")} ${t("lastname")}!`,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row id="row2" gutter={16}>
              <Col span={6}>
                <Form.Item<FieldType>
                  label={t("birthday")}
                  name="birthday"
                  rules={[
                    {
                      required: true,
                      message: `${t("pleaseInput")} ${t("birthday")}!`,
                    },
                  ]}
                  getValueProps={(value) => ({
                    value: value && dayjs(value),
                  })}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="YYYY-MM-DD"
                    format={"YYYY-MM-DD"}
                  />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item<FieldType>
                  label={t("nationality")}
                  name="nationality"
                  rules={[
                    {
                      required: true,
                      message: `${t("pleaseInput")} ${t("nationality")}!`,
                    },
                  ]}
                >
                  <Select
                    placeholder={`"- - ${t("pleaseSelect")} - -"`}
                    options={[
                      { value: "thai", label: t("thai") },
                      { value: "myanmar", label: t("myanmar") },
                    ]}
                  ></Select>
                </Form.Item>
              </Col>
            </Row>
            <Row id="row3" gutter={16}>
              <Col span={24}>
                <Form.Item<FieldType> label={t("citizenID")}>
                  <Row>
                    {citizenId.map((value, index) => (
                      <div style={{ display: "contents" }} key={index}>
                        <Col
                          span={
                            index === 0
                              ? 2
                              : index === 3
                              ? 3
                              : index === 4
                              ? 2
                              : 5
                          }
                        >
                          <Input
                            id={`citizen-id-${index}`}
                            value={value}
                            maxLength={
                              index === 0
                                ? 1
                                : index === 1
                                ? 4
                                : index === 3
                                ? 2
                                : index === 4
                                ? 1
                                : 5
                            }
                            style={{ textAlign: "center" }}
                            onChange={(e) =>
                              handleCitizenID(
                                e.target.value,
                                index,
                                index === 0
                                  ? 1
                                  : index === 1
                                  ? 4
                                  : index === 3
                                  ? 2
                                  : index === 4
                                  ? 1
                                  : 5
                              )
                            }
                          />
                        </Col>
                        <Col
                          style={{
                            display: index === 4 ? "none" : "",
                            textAlign: "center",
                            paddingTop: 5,
                          }}
                          span={1}
                        >
                          <Text>-</Text>
                        </Col>
                      </div>
                    ))}
                  </Row>
                </Form.Item>
              </Col>
            </Row>
            <Row id="row4" gutter={16}>
              <Col span={24}>
                <Form.Item<FieldType>
                  label={t("gender")}
                  name="gender"
                  rules={[
                    {
                      required: true,
                      message: `${t("pleaseInput")} ${t("gender")}!`,
                    },
                  ]}
                >
                  <Radio.Group>
                    <Radio value={"male"}>{t("male")}</Radio>
                    <Radio value={"female"}>{t("female")}</Radio>
                    <Radio value={"unisex"}>{t("unisex")}</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row id="row5" gutter={16}>
              <Col span={24}>
                <Row>
                  <Col span={7}>
                    <Form.Item<FieldType>
                      label={t("mobilePhone")}
                      name="prefix"
                      rules={[
                        {
                          required: true,
                          message: `${t("pleaseInput")} ${t("mobilePhone")}!`,
                        },
                      ]}
                    >
                      <Select
                        value={prefix}
                        options={[
                          { value: "+66", label: "+66" },
                          { value: "+01", label: "+01" },
                        ]}
                        onChange={(value) => handlePrefix(value)}
                      ></Select>
                    </Form.Item>
                  </Col>
                  <Col style={{ textAlign: "center", paddingTop: 5 }} span={1}>
                    <Text>-</Text>
                  </Col>
                  <Col span={8}>
                    <Form.Item<FieldType>
                      name="mobilePhone"
                      rules={[
                        {
                          required: true,
                          message: `${t("pleaseInput")} ${t("mobilePhone")}!`,
                        },
                      ]}
                    >
                      <Input maxLength={9} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row id="row6" gutter={16}>
              <Col span={10}>
                <Form.Item<FieldType> label={t("passportNo")} name="passportNo">
                  <Input maxLength={9} />
                </Form.Item>
              </Col>
            </Row>
            <Row id="row7" gutter={16}>
              <Col span={10}>
                <Form.Item<FieldType>
                  label={t("expectedSalary")}
                  name="expectedSalary"
                  rules={[
                    {
                      required: true,
                      message: `${t("pleaseInput")} ${t("expectedSalary")}!`,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={14}>
                <Row justify={"center"}>
                  <Col span={6}>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                      <Button onClick={onReset}>{t("reset")}</Button>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                      <Button htmlType="submit">{t("submit")}</Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Row
        style={{
          paddingTop: 48,
          paddingBottom: dataListStore.length ? 0 : 48,
        }}
        justify={"center"}
        align={"middle"}
      >
        <Col span={22}>
          <Space>
            <Checkbox onChange={(e) => onSelectAll(e.target.checked)}>
              {t("selectAll")}
            </Checkbox>
            <Button onClick={() => onDelete()}>{t("delete")}</Button>
          </Space>
        </Col>
      </Row>
      <Row justify={"center"}>
        <Col span={22}>
          <Table
            rowSelection={rowSelection}
            dataSource={dataListStore}
            columns={columns}
            pagination={{ position: ["topRight"] }}
            rowKey="id"
          />
        </Col>
      </Row>
    </div>
  );
};

export default Page;
