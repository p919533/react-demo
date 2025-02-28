import { useEffect, useState } from 'react';
import { Form, Upload, message } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import { isValidNonEmpty } from "@/utils";
import * as api from "@/api";

const { Dragger } = Upload;

// 图片上传
export const CustomizeUpload = ({ name, label, limitSize, width, height, accept = 'image/png', uploadText, style, ...props }: any) => {
    const form = Form.useFormInstance();
    const fileValue = form.getFieldValue(name)
    const [fileList, setFileList] = useState<any[]>([])
    const [loading, setLoading] = useState(false);
    // 自定义上传请求
    const customRequest = async ({ onSuccess, file }: any) => {
        const { file_info }: any = await api.postFileUpload({
            file,
            category: 'game'
        })

        const data = {
            id: file_info.id,
            status: 'done',
            thumbUrl: api.getImgUrl(file_info.path),
            url: api.getImgUrl(file_info.path),
            percent: 100
        }

        onSuccess(data)

    };

    // 文件上传前校验格式 大小
    const beforeUpload:any = (file: any) => {
        if (accept.indexOf(file.type) === -1) {
            const m = accept.replace(/image\//g, '');
            message.error(`请上传图片${m}`)
            return Promise.reject();
        }
        else if (file.size > limitSize) {
            message.error(`文件大小超过限制，请上传小于${limitSize / 1024}KB`)
            return Promise.reject();
        }

        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onload = (e: any) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const img_width = img.naturalWidth;
                    const img_height = img.naturalHeight;
                    console.log('onload====================================', img_width, img_height)
                    // 这里可以加入判断条件来决定是否允许上传
                    if (img_width !== width || img_height !== height) {
                        message.error(uploadText);
                        return reject();  // 阻止上传
                    } else {
                        console.log('成功====================================', img_width, img_height)
                        return resolve();
                    }
                };
                img.onerror = () => {
                    message.error('图片加载失败');
                    return reject(); // 图片加载失败，拒绝上传
                };
            };

            
    
            reader.readAsDataURL(file);
        })


        // return Promise.reject(); 
    };

    // 上传前 与 上传完成
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


    const uploadButton = (
        <>
            {loading ? <LoadingOutlined /> : <PlusOutlined style={{ fontSize: '28px', color: '#999' }} />}
            <div style={{ fontSize: '12px', color: '#999' }}>点击上传</div>
            <div style={{ fontSize: '12px', color: '#999' }}>{uploadText}</div>
        </>
    )

    const imgList = (
        <>
            <img src={fileList[0]?.url} alt="avatar" style={{ width: '100%',height:'100%' }} />
        </>
    )

    // console.log('fileList===', fileList, fileValue)
    return (
        <Form.Item
            name={name}
            label={label}
            {...props}
        >

            <Dragger
                accept={accept}
                listType="picture-card"
                beforeUpload={beforeUpload}
                customRequest={customRequest}
                onChange={handleChange}
                showUploadList={false}
                style={style}
                height={parseInt(style.height)}
            >
                {
                    !fileList.length ? uploadButton : imgList
                }
            </Dragger>


            {/* <Upload
                accept="image/png"
                listType="picture-card"
                beforeUpload={beforeUpload}
                customRequest={customRequest}
                onChange={handleChange}
                showUploadList={false}
            >
                {
                    !fileList.length ? uploadButton : imgList
                }
            </Upload> */}
        </Form.Item>
    )
}