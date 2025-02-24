import React from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
import Logo from '/vite.svg'
import styled from './index.module.less';

type FieldType = {
    name?: string;
    password: string;
    remember?: string;
};



const Login: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const onFinish = async ({ name, password }: FieldType) => {
        console.log('values');

        if (name !== 'admin') {
            return messageApi.error('账号错误')
        }
        if (password !== 'admin1234') {
            return messageApi.error('秘密错误')
        }

        navigate("/dashboard");

    };

    return (
        <>
            {contextHolder}
            <div className={styled.Login}>
                <div className={styled.LoginContainer}>
                    <div className={styled.Logo}>
                        <img src={Logo} alt="" />
                    </div>
                    <Form
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            name="name"
                            rules={[{ required: true, message: '请输入用户名!' }]}
                        >
                            <Input prefix={<UserOutlined />} />
                        </Form.Item>

                        <Form.Item<FieldType>
                            name="password"
                            rules={[
                                { required: true, message: '请输入密码!' },
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} />
                        </Form.Item>

                        <Form.Item<FieldType>
                            name="remember"
                            valuePropName="checked"
                        >
                            <Checkbox>记住密码</Checkbox>
                        </Form.Item>

                        <Form.Item >
                            <Button type="primary" htmlType="submit" block>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default Login;