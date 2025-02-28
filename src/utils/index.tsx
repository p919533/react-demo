export const getItem = (key: string) => {
    return sessionStorage.getItem(key)
}


export const setItem = (key: string, value: any) => {
    const values = typeof value === 'object' ? JSON.stringify(value) : value
    return sessionStorage.setItem(key, values)
}


export const removeItem = (key: string) => {
    return sessionStorage.removeItem(key)
}

/**
 * 生成随机数
 */
export function uuid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
}

/**
 * 判断不为空
 * */
export function isValidNonEmpty(value: any) {
    // 检查是否为null或undefined  
    if (value === null || value === undefined) {
        return false;
    }

    // 检查是否为空字符串  
    if (typeof value === 'string' && value.length === 0) {
        return false;
    }

    // 检查是否为空数组  
    if (Array.isArray(value) && value.length === 0) {
        return false;
    }

    // 检查是否为空对象（非null且没有自有属性的对象）  
    if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) {
        return false;
    }

    // 如果通过了以上所有检查，则认为是有效的非空值  
    return true;
}



// 其他字符都被替换为*号
export function maskString(str: string) {
    const len = str.length
    // 首先检查字符串的长度是否大于1，如果不是，则直接返回原字符串  
    if (str.length <= 1) {
        return str;
    }

    // 创建一个新的字符串数组，除了首尾字符，其他位置都放置'*'  
    let masked = [];
    masked.push(str[0], str[1]); // 第一个字符  
    for (let i = 2; i < 8; i++) {
        masked.push('*');
    }
    masked.push(str[len - 1], str[len - 2]); // 最后一个字符  

    // 将数组转换为字符串并返回  
    return masked.join('');
}

/**
 * 根据状态值 返回对应的显示文字
 * */
export function optToStr(value: string | number, options: any[]) {
    return options.find(item => item.value == value)?.label
}


export const regex = {
    account: /^[a-zA-Z0-9]{4,16}$/,
    
    pass: /(?!^[0-9]+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)^.[^\s\u4e00-\u9fa5]{5,16}$/,
    // 重复数字
    sameDigits: /^(\d)\1{5}$/,
    // 连续数字
    consecutiveNumbers: /^(012345|123456|234567|345678|456789)$/,
    // 提现密码长度
    withdrawal: /^\d{6}$/,
    // 邮箱
    email: /^[a-zA-Z0-9_]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)?$/,
    // 金额
    amount: /[^0-9]/g,
    // 校验数字
    number: /^\d+$/,
    // 订单金额 - 稽核倍数
    amountNumber: /^[0-9]+(\.[0-9]+)?$/,
    // 稽核
    auditRateNumber: /^(0|[1-9]\d*)(\.\d+)?$/
}
/**
 * 校验金额 / 稽核
 * 小数点2位
 * 最大12位
 * */

// 稽核倍数最大6位 ，
// 稽核值 金额最大 12位
export const validateAmount = (value: any, number = 6) => {
    // 检查是否包含非数字字符（除了小数点）
    if (!regex.amountNumber.test(value)) {
        return {
            type: 'error',
            message: '输入的必须是数字'
        };
    }

    // 检查小数点后是否超过两位
    const [integer, decimal] = `${value}`.split('.');
    // 检查是否超出6位
    if (integer.length > number) {
        return {
            type: 'error',
            message: `数字最大不能超过${number}位`
        };
    }
    // 检查小数点后是否超过两位
    if (decimal && decimal.length > 2) {
        return {
            type: 'error',
            message: '小数点最多两位'
        };
    }
    return {
        type: 'success',
        message: ''
    };
}

// 校验比例
export const validateRatio = (value: any, number: number) => {
    // 检查是否包含非数字字符（除了小数点）
    if (!regex.amountNumber.test(value)) {
        return {
            type: 'error',
            message: '输入的必须是数字'
        };
    }

    if (!(value > 0 && value <= number)) {
        console.log(value)
        return {
            type: 'error',
            message: `0<返奖比例≤${number}`
        };
    }
    // 检查小数点后是否超过两位
    const [_, decimal] = `${value}`.split('.');
    // 检查小数点后是否超过两位
    if (decimal && decimal.length > 2) {
        return {
            type: 'error',
            message: '小数点最多两位'
        };
    }
    return {
        type: 'success',
        message: ''
    };
}


/**
 * 校验数字
 * */
export const validateNumber = (value: any) => {
    // 检查是否包含非数字字符（除了小数点）
    if (!regex.number.test(value)) {
        return {
            type: 'error',
            message: '输入的必须为整数'
        };
    }

    return {
        type: 'success',
        message: ''
    };
}