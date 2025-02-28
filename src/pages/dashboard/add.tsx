import React, { useState } from "react"
import { Button, Modal, Checkbox, Form, Input, Radio, DatePicker, Select, Switch } from 'antd';
import { QuillComponent } from '@/components'
const { RangePicker } = DatePicker;





export const Add= ({ type, title, record, onRefresh, children }: any) => {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);

    const showModal = async () => {
        if (title.indexOf('新增') === -1) {
           
        }
        setOpen(true);
    };

    //提交
    const onCreate = async (values: any) => {
        try {
            handleCancel()
        } catch (e: any) {
            console.error(`e`);
        }

    };

    const handleCancel = () => {
        form.resetFields()
        setOpen(false);
    };

    const porpsButton: any = {
        type: "primary",
        onClick: showModal,
        children: children || title
    }
    return (
        <>
            {
                title.indexOf('新增') > -1
                    ? <Button {...porpsButton} />
                    : <Button {...porpsButton} />
            }
            <Modal
                title={title}
                open={open}
                okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
                onCancel={handleCancel}
                destroyOnClose
                width={1000}
                styles={{
                    body: {
                        paddingTop: '20px',
                    }
                }}
                {
                ...(title === '详情' ? { footer: null } : {})
                }
                modalRender={(dom) => (
                    <Form
                        form={form}
                        name="basic"
                        labelWrap
                        disabled={title === '详情'}
                        labelCol={{ flex: '120px' }}
                        wrapperCol={{ flex: 1 }}
                        initialValues={{}}
                        clearOnDestroy
                        onFinish={(values) => onCreate(values)}
                        autoComplete="off"
                    >
                        {dom}
                    </Form>
                )}
            >
                
                <Form.Item
                    label="内容"
                    name="content"
                    rules={[{ required: true }]}
                    // className={styled.showContent}
                >
                    <QuillComponent type={type} title={title} />
                </Form.Item>
                
            </Modal>
        </>
    );

}





