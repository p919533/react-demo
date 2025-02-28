import { createFromIconfontCN } from '@ant-design/icons';

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4668202_q3ahnza6f3k.js',
});

export const Icon = ({ type, ...props}: any) => {
    return <IconFont type={type} {...props}/>
}
