import connectDB from "./db";
import User from "../models/User";
import addUser from "./addUser";

jest.mock('../models/User');
jest.mock('./db');

describe('addUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call connectDB', async () => {
        await addUser('John Doe', 'John@example.com','password', [{name: 'w-name',address:'adress1'},], [{name: 'e-name',OAuth:'OAuth1'}]);

        expect(connectDB).toHaveBeenCalled();
    });

    it('should create a new User instance with correct parameters', async () => {
        const mockUser = {
            save: jest.fn().mockResolvedValue(true)
        };
        (User as unknown as jest.Mock).mockImplementation(() => mockUser);

        await addUser('John Doe', 'John@example.com','password', [{name: 'w-name',address:'adress1'},], [{name: 'e-name',OAuth:'OAuth1'}]);

        expect(User).toHaveBeenCalledWith({
            name: 'John Doe',
            email: 'John@example.com',
            password: 'password',
            wallet: [{name: 'w-name',address:'adress1'},],
            exchange: [{name: 'e-name',OAuth:'OAuth1'}]
        });
    });

    it(`should create a new User instance with empty wallet and exchange if they're not provided`, async () => {
        const mockUser = {
            save: jest.fn().mockResolvedValue(true)
        };
        (User as unknown as jest.Mock).mockImplementation(() => mockUser);

        await addUser('John Doe', 'John@example.com','password');

        expect(User).toHaveBeenCalledWith({
            name: 'John Doe',
            email: 'John@example.com',
            password: 'password',
            wallet: [],
            exchange: []
        });
    });

    it('should call user.save', async () => {
        const mockUser = {
            save: jest.fn().mockResolvedValue(true)
        };
        (User as unknown as jest.Mock).mockImplementation(() => mockUser);

        await addUser('John Doe', 'John@example.com','password', [{name: 'w-name',address:'adress1'},], [{name: 'e-name',OAuth:'OAuth1'}]);

        expect(mockUser.save).toHaveBeenCalled();
    });

    it('should return the created user', async () => {
        const mockUser = {
            save: jest.fn().mockResolvedValue(true)
        };
        (User as unknown as jest.Mock).mockImplementation(() => mockUser);

        const result = await addUser('John Doe', 'john@example.com', 'password123', [{name: 'w-name',address:'adress1'},], [{name: 'e-name',OAuth:'OAuth1'}]);

        expect(result).toBe(mockUser);
    });

    it('should handle error from connectDB', async()=>{
        (connectDB as jest.Mock).mockImplementation(()=>{
            throw new Error('Could not connect to database');
        });

        await expect(addUser('John Doe', 'john@example.com', 'password123', [{name: 'w-name',address:'adress1'},], [{name: 'e-name',OAuth:'OAuth1'}]))
        .rejects
        .toThrow('Could not connect to database'); 
        
        expect(connectDB).toHaveBeenCalled();
    });
});