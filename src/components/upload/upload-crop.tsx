import { useEffect, useState } from 'react';
import { Form, Upload, message, Button, Flex } from 'antd';
import { PlusOutlined, LoadingOutlined, UploadOutlined } from '@ant-design/icons'
import { isValidNonEmpty } from "@/utils";
import * as api from "@/api";
import ImgCrop from 'antd-img-crop';
import styled from "./index.module.less";

// 图片上传
export const UploadCrop = ({
    name,
    label,
    category = 'game',
    width,
    height,
    upload = {},
    className,
    ...props
}: any) => {
    const form = Form.useFormInstance();
    const fileValue = form.getFieldValue(name)
    const [fileList, setFileList] = useState<any[]>([])
    const [loading, setLoading] = useState(false);


    // const { maxCount = 1, listType } = upload;
    // 自定义上传请求
    const customRequest = async ({ onSuccess, file }: any) => {
        // setLoading(true);
        const { file_info }: any = await api.postFileUpload({
            file,
            category
        })

        const data = {
            id: file_info.id,
            status: 'done',
            thumbUrl: api.getImgUrl(file_info.path),
            url: api.getImgUrl(file_info.path),
            percent: 100
        }

        form.setFieldsValue({
            [name]: data
        })

        // setLoading(false);

        // setFileList([
        //     data
        // ])

        onSuccess([data])

    };

    // 文件上传前校验格式 大小
    const beforeUpload = (file: any) => {
        const limitSize = 1024 * 1024
        if (file.type !== 'image/png') {
            message.error('请上传png图片')
            return false;
        }
        else if (file.size > limitSize) {
            message.error('文件大小超过限制，请上传小于1MB')
            return false;
        }

        return true;
    };

    /**
     * 上传前 与 上传完成
     * */
    const handleChange = (info: any) => {
        const { file }: any = info
        if (file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (file.status === 'done') {
            setLoading(false);
            setFileList([
                file.response
            ])
        }
    };



    useEffect(() => {
        if (isValidNonEmpty(fileValue?.id)) {
            setFileList([
                fileValue
            ])
        }
    }, [fileValue])




    return (
        <Form.Item
            name={name}
            label={label}
            {...props}
        >
            <ImgCrop
                aspect={width / height}
                modalWidth={1000}
                modalTitle='图片剪裁'
                rotationSlider
                cropperProps={{
                    cropSize: { width, height },
                    style: {
                        containerStyle: {
                            height: 600
                        },
                    },
                }}
            >
                <Upload
                    accept="image/png"
                    listType="picture-card"
                    beforeUpload={beforeUpload}
                    customRequest={customRequest}
                    onChange={handleChange}
                    // fileList={fileList}
                    // onRemove={handleRemove}
                    showUploadList={false}
                    className={styled.imgCrop}
                    {...upload}
                >
                    {
                        !fileList.length
                            ? <UploadButton loading={loading} className={className} />
                            : <ImgList fileList={fileList} className={className} />
                    }
                </Upload>
            </ImgCrop>
        </Form.Item>
    )
}


/**
 * 按钮
 * */
function UploadButton({ loading, className }: any) {
    return (
        <Flex align='center' justify='center' wrap='wrap' className={`${styled.upload} ${styled[className]}`}>
            <div className={styled.upload_icon}>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
            </div>
            <div className={styled.upload_text}>点击上传</div>
        </Flex>
    )
}

/**
 * 图片
*/
export function ImgList({ className, fileList, onClick }: any) {
    return (
        <>
            {
                fileList.map((item: any, index: number) => {
                    return (
                        <div key={index} className={`${styled.upload} ${styled[className]} ${item.selected ? styled.uploadSelected: ''}`} onClick={()=>onClick && onClick(item)}>
                            <img src={item?.url} alt="avatar" style={{ width: '100%' }} />
                        </div>
                    )
                })
            }
        </>
    )
}