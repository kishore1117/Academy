class UserModel {
    constructor(name, email, phone_number,role,password) {
        this.name = name;
        this.email = email;
        this.phone_number = phone_number,
        this.password = password
        this.role = role;
    }

    static validate(user) {
        const errors = [];
        if(user.name == ""){
            errors.push('name is required');
        }
        if(user.name){
            if ( typeof user.name !== 'string') {
                errors.push('name is required and must be a string');
            }
        }

        if(user.email){
            if (typeof user.email !== 'string') {
                errors.push('Email is required and must be a string');
            } else if (!isValidEmail(user.email)) {
                errors.push('Invalid email format');
            }
        }
        if(user.phone_number){
            if(!isValidMobileNumber(user.phone_number)){
                errors.push('Phone number is required and must be valid')
            }
        }
        if(user.password){
            if (typeof user.password !== 'string' || !isValidPassword(user.password)) {
                errors.push('Invalid password format. Password must contain at least one character and one number, and be at least 8 characters long');
            }
        }
        if(user.role){
            if (!Object.values(UserModel.Roles).includes(user.role)) {
                errors.push('Role contains invalid value');
            }
        }
        return errors;
    }
}

function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}
function isValidMobileNumber(mobileNumber) {
    const mobileNumberRegex = /^\d{10}$/;
    return mobileNumberRegex.test(mobileNumber);
}
function isValidPassword(password) {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
}

UserModel.Roles = {
    USER: 'user',
    ADMIN: 'admin'
};
module.exports = UserModel;