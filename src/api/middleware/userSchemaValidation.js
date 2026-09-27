
export function validatorMIddleware(schema) {
    return (req, res, next) => {
        const {error, value} = schema.validate(req.body, {abortEarly : false})
        if(error){
            console.log(error)
            return res.status(400).json({error: error.details.map(err => err.message)})
        }

        req.body = value;
        next()
    }
}