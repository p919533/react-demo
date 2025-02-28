import { useEffect, useRef, useImperativeHandle, forwardRef, useState, useMemo } from 'react';
// import * as api from "@/api";
import ReactQuill from 'react-quill';
// import Quill from 'quill';
import 'react-quill/dist/quill.snow.css';
import './index.css';


let fontSizes = ['12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '30px', '32px', '34px', '36px'];




export const QuillComponent = forwardRef((props: any, propsRef: any) => {
    const { title, value, onChange } = props;
    const [valueHtml, setValueHtml] = useState('');

    const quillEdit: any = useRef(null)

    // 在组件加载时设置 Quill 的字体大小白名单
    useEffect(() => {
        const { Quill }: any = ReactQuill;  // 获取 Quill 实例

        // 设置 Quill 的字体大小白名单
        Quill.imports['attributors/style/size'].whitelist = fontSizes;


        // 注册配置
        Quill.register(Quill.imports['attributors/style/size']);

    }, []);


    function handleImage() {
        // 创建一个文件输入框
        const input: any = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();


        input.onchange = () => {
            // 获取选择的文件
            const file = input.files[0];

            // api.postFileUpload({
            //     file,
            //     category: 'message'
            // }).then(({ file_info }: any) => {
            //     // 获取图片预览地址
            //     const url = api.getImgUrl(file_info.path);
            //     // 获取到编辑器实例
            //     let quill = quillEdit.current.getEditor();
            //     // 获取当前光标位置
            //     const cursorPosition = quill.getSelection().index;
            //     // 插入图片
            //     quill.insertEmbed(cursorPosition, 'image', url);
            //     quill.setSelection(cursorPosition + 1); // 光标位置加1
            // })

        };

    }





    function handleChange(e: any) {

        setValueHtml(e)

        onChange(e)
    }




    useEffect(() => {
        if (!value || title == '详情') {
            return
        }

        setValueHtml(value)

    }, [value])


    const modules = useMemo(() => {
        return {
            toolbar: {
                container: [
                    [{ size: fontSizes }],
                    [{ font: [] }], // 字体
                    ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
                    ['blockquote', 'code-block'], // 引用，代码块
                    [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }], // 列表 对齐方式
                    [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
                    ['clean'], // 清除字体样式
                    ['image', 'link'],
                ],
                handlers: {
                    image: handleImage
                }
            }
        }
    }, []);


    if (title === '详情') {
        return (
            <div
                className='custom-disabled'
                style={{ height: 400, overflowY: 'scroll' }}
                dangerouslySetInnerHTML={{ __html: value }}
            />
        )
    }


    return (
        <ReactQuill
            theme="snow"
            ref={quillEdit}
            value={valueHtml}
            modules={modules}
            placeholder="请输入图文详情"
            onChange={handleChange}
        />
    );
});

