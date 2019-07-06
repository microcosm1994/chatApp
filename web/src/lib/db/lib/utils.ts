export default {
    /**
     * 去掉字符串中的全部空格
     * @method:trim
     * @param:{string} str:需要处理的字符串
     * @return:{string} 返回处理完成的字符串
     * */
    trim (str:string) {
        return str.replace(/\s*/g,"")
    }
}
