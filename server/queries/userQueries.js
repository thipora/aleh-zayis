export const loginUserQuery = () => {
    return ` SELECT 
        name, password
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