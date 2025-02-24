import { useEffect, useState, lazy, Suspense, useLayoutEffect } from 'react';
import {
    Outlet,
    useNavigate,
    useLocation
} from 'react-router-dom';
import { Layout, Flex, Badge, Progress, Select, Breadcrumb, theme, Dropdown, Menu } from 'antd';
import * as api from "@/api";
import router, { routerAndTree } from "@/router";
import { HistoryTag } from "./components";
import Logo from '/vite.svg'
import styled from './index.module.less'




const { Header, Content, Footer } = Layout;

const { useToken } = theme;




export const BasicLayout = () => {
    // const { tagsView, addTagsView, delTagsView }: any = useGlobal()
    // const { lang, setLang }: any = useI18nStore();
    // const { menusRouter, menusList, fetchSystemMenuList }: any = useSystemMenuList()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);
    const [menus, setMenus] = useState([])

    const [routers, setRouters] = useState([])

    const [routerMap, setRouterMap] = useState<any>(new Map())
    const location = useLocation();

    const { pathname, search } = location;


    async function fetch_systemMenuList() {
        try {
            const list = await api.systemMenuList()
            const { router, menus, routerMap } = routerAndTree(list)

            // console.log('list', router, menus, routerMap);

            setRouters(router)
            setMenus(menus)
            setRouterMap(routerMap)

        } catch (error) {
            console.log('fetch_systemMenuList==', error);
        }
    }


    useLayoutEffect(() => {
        if (menus.length == 0) {
            console.log('初始化路由');
            fetch_systemMenuList()
        }
    }, [])


    // 从浏览器输入 回车
    useEffect(() => {
        if (menus.length > 0) {
            console.log('手动注入路由');
            // 注入路由
            router.routes[0].children = routers;
            // replace一下当前路由，为了触发路由匹配
            router.navigate(`${pathname}${search}`, { replace: true });

        }
    }, [menus.length])

    return (
        <Layout>
            <Header className={styled.Header}>
                <div className={styled.Logo} >
                    {/* <img src={Logo} alt="" /> */}
                </div>

                <Menu
                    mode="horizontal"
                    theme="dark"
                    items={menus}
                    onClick={(e: any) => {
                        // setTagsView(e.item.props.handle)
                        navigate(e.item.props.route)
                    }}
                    className={styled.NavMenu}
                />

            </Header>

            <HistoryTag
                routerMap={routerMap}
            />

            <Content className={styled.Content}>
                <Suspense fallback={<div style={{ color: "red", fontSize: '38px' }}>loading</div>}>
                    <Outlet />
                </Suspense>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
            </Footer>
        </Layout>
    )
}