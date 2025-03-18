export const loginUserQuery = () => {
    return ` SELECT 
        id_user, name, password, account_type
    FROM 
        users 
    WHERE 
        name = ?`;
}
export const registerUserQuery = () => {
    return ` SELECT 
        1
    FROM 
        users 
    WHERE 
        name = ?`;
}