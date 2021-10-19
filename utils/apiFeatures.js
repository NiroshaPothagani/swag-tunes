
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
       const queryObj = {...this.queryString };
         //Advance filtering
         /* 
            let queryStr = JSON.stringify(queryObj);
            queryStr  = queryStr.replace(//REGEX.match => `$$(match)`);
            console.log(JSON.parse(queryStr));
        */
        return this;
    }

    sort() {
        if(this.queryString.sort) {
                const sortBy = this.query.sort.split(',').join(' ');
                this.query = this.query.sort(sortBy);
            } else {
                this.query = this.query.sort('-id');
            }
        return this;
    }

    limitFields() {
        if(this.queryString.fields) {
            const fields = this.query.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('+ __v');
        }
        return this;
    }
    paginating() {
        const page = this.query.page*1 || 1;
        const limit = this.query.limit*1 || 100;
        const skip = (page - 1) * limit;
 
        this.query = this.query.skip(skip).limit(limit);
 
        return this;
    }
}

module.exports = APIFeatures;