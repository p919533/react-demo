import menu from "./menu.json";

/**
 * 获取菜单权限
 * @param data - 登录所需的数据对象，包括用户名和密码等信息
 * @returns Promise 对象，解析后返回登录操作的结果
 */
export async function systemMenuList() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(menu)
        })
    })
}
