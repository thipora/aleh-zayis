export const loginUserQuery = () => {
    return ` SELECT 
        id_user, name, password, account_type
    FROM 
        users 
    WHERE 
        email = ?`;
}

export const registerUserQuery = () => {
    return ` SELECT 
        1
    FROM 
        users 
    WHERE 
        email = ?`;
}