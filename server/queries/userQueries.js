export const loginUserQuery = () => {
    return ` SELECT 
        name, password
    FROM 
        users 
    WHERE 
        name = ?`;
}