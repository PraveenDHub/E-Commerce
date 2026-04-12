class APIHelper {
    constructor(query, str) {
        this.query = query;
        this.str = str;
        // console.log(this.query);
        // console.log(this.str);
    }

    search() {
        const obj = this.str.keyword ? {
            name:{
                $regex : this.str.keyword,
                $options:"i",
            }
        } : {};
        this.query = this.query.find(obj);
        return this;
    }

    filter() {
        const copystr = {...this.str};
        const removeFeilds = ["keyword", "page", "limit"];
        removeFeilds.forEach(key => delete copystr[key]);
        this.query = this.query.find(copystr);
        return this;
    }

    pagination(resPerPage) {
        let currPage = Number(this.str.page) || 1;
        if(currPage < 1){
            currPage = 1;
        }
        const skip = resPerPage * (currPage - 1);
        this.query = this.query.skip(skip).limit(resPerPage);
        return this;
    }
}

export default APIHelper;
