import { useEffect, useState, lazy, Suspense } from 'react';
import {
    Outlet, useLoaderData,
    useLocation,
    useMatches,
    useNavigate,
    Link
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { localesOptions } from '@/i18n'
import { Layout, Flex, Badge, Progress, Select, Breadcrumb, theme, Dropdown } from 'antd';
import { PayCircleOutlined, TeamOutlined, SoundOutlined, QuestionCircleOutlined, CloseOutlined, DownOutlined } from '@ant-design/icons';
import { useI18nStore, useSystemMenuList, useGlobal } from '@/store'
import { getItem, setItem, removeItem } from "@/utils";
import styled from './index.module.less'



export function HistoryTag({ routerMap }: any) {

    const [historyTags, setHistoryTags] = useState<any>([])
    const navigate = useNavigate()
    const location = useLocation();

    const { pathname, search } = location;



    useEffect(() => {
        const tag = routerMap.get(pathname)
        if (tag) {
            addHistory({
                ...tag,
                url: tag?.route + search
            })
        }
    }, [location, routerMap.size])

    // 关闭单个
    function handleClose(event: any, tag: any) {
        event.stopPropagation();
        delHistory(tag, 'close-current')
    }

    // 只留当前
    function handleKeepCurrentClose() {
        const currentTag = historyTags.filter((tag: any) => tag.selected);
        if (currentTag.length) {
            delHistory(currentTag, "keep-current");
        }
    }



    function addHistory(tags: any) {

        const historyTags: any = new Map(
            (JSON.parse(getItem('historyTags') as any) || []).map((tag: any) => [tag.route, tag])
        );

        console.log('tags===', tags);
        

        // 更新或添加新标签
        historyTags.set(tags.route, { ...tags, selected: true });

        // 更新选中状态
        historyTags.forEach((tag: any, key: string) => {
            if (key !== tags.route) {
                tag.selected = false;
            }
        });


        console.log('historyTags===', historyTags);
        


        const newHistoryTags = Array.from(historyTags.values());


        // 本地存储和 Zustand 状态更新
        setItem('historyTags', newHistoryTags);

        setHistoryTags(newHistoryTags)
    }


    function delHistory(tag?: any, mode?: any) {
        // 关闭所有标签
        let newHistoryTags = []
        let path = '/dashboard'

        // 保留当前标签
        if (mode === "keep-current") {
            tag.selected = true;
            newHistoryTags = [...historyTags]
            path = tag.url
        }
        // 关闭当前
        else if (mode === 'close-current') {
            const newTags = historyTags.filter((item: any) => item.route !== tag.route)
            const lastTag = newTags[newTags.length - 1];
            lastTag.selected = true
            path = lastTag.url
            newHistoryTags = newTags
        }

        setItem('historyTags', newHistoryTags);
        setHistoryTags(newHistoryTags);
        navigate(path);
    }

    const onOpen = (tag: any) => {
        navigate(tag.url);
    }


    return (
        <Flex className={styled.history}>
            <div className={styled.history_left}>
                <Flex>
                    {
                        historyTags.map((item: any, index: number) => {
                            return (
                                <div
                                    key={item.route}
                                    onClick={() => onOpen(item)}
                                    className={`${styled.history_tag} ${item?.selected ? styled.history_tag_selected : ''}`}
                                >
                                    {item?.label}
                                    {
                                        historyTags.length > 1 && <CloseOutlined
                                            style={{ fontSize: 10, marginLeft: 6 }}
                                            onClick={(e: any) => handleClose(e, item)}
                                        />
                                    }


                                </div>
                            )
                        })
                    }
                </Flex>
            </div>

            <Dropdown
                placement="bottomLeft"
                menu={{
                    items: [
                        {
                            key: '1',
                            label: (
                                <span
                                    className={styled.history_text}
                                    onClick={() => handleKeepCurrentClose()}
                                >
                                    只留当前
                                </span>
                            ),
                        },
                        {
                            key: '2',
                            label: (
                                <span
                                    className={styled.history_text}
                                    onClick={delHistory}
                                >
                                    全部关闭
                                </span>
                            ),
                        },

                    ]
                }}
            >
                <div className={styled.history_bottom}>
                    批量关闭
                    <DownOutlined />
                </div>
            </Dropdown>
        </Flex>
    )
}