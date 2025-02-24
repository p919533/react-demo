import { lazy} from 'react';
import { Icon } from '@/components'

const modules = import.meta.glob('../pages/*/index.tsx');

const components = Object.keys(modules).reduce<Record<string, any>>((prev, cur) => {
    const path = cur.replace('../pages', '').replace('/index.tsx', '')
    prev[path] = modules[cur];
    return prev;
}, {}) as any;

// let routerMap = new Map()

export function routerAndTree(list: any[]) {

    // 路由映射表
    let routerMap: Map<string, any> = new Map();


    function loop(list: any[], parentId = 0, route = '') {

        // 路由树
        let router: any = [];
        // 菜单树
        let menus: any = []


        list.forEach((menu: any) => {

            const routerItem: any = {
                id: menu.id,
                path: `${menu.path}`,
            };

            // 路由匹配需要
            if (components[menu.filePath]) {
                routerItem.Component = lazy(components[menu.filePath]);
            }
    
            const menusItem: any = {
                key: menu.id,
                label: menu.label,
                route: menu.path,
                popupOffset: [-40, 6],
                parentId: menu.parent_id,
                icon:
                    menu.parent_id === 0
                        ? <div style={{ display: 'block' }}>
                            <Icon type={menu.icon} style={{ fontSize: '18px' }} />
                        </div>
                        : null,
    
            }

    
    
            // If the current item's parent matches the parentId, process it
            if (menusItem.parentId === parentId) {
                const newRoute = route + '/' + menusItem.route;
                // Recursively find children for the current item
                const { router: routerChildren, menus: menusChildren } = loop(list, menu.id, newRoute);

                if (routerChildren.length && menusChildren.length) {
                    routerItem.children = routerChildren;
                    menusItem.children = menusChildren
                }

                const newMenusItem = { ...menusItem, route: newRoute }
                menus.push(newMenusItem);
                router.push(routerItem);


                // 将 newRoute 和对应的 menusItem 存入 Map 中
                routerMap.set(newRoute, newMenusItem);

                menusChildren.forEach((menuItem:any) => {
                    routerMap.set(newRoute, { ...menuItem });
                });
            }
    
        });
    
        return {
            router,
            menus,
            routerMap
        };
    }

    return {
        ...loop(list),
        routerMap
    }
}