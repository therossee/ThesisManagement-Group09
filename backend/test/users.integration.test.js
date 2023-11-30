require('jest');
const request = require("supertest");
const usersDao = require("../users_dao");
const {app, server} = require("../index");
const passport = require('passport');

jest.mock('../users_dao', () => ({
  getUser: jest.fn(),
  getUserInfo: jest.fn(),
}));

afterAll((done) => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  server.close(done);
});

const teacherAccessToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imt4VHlraUVwT05RRnYxZG4tc2JXVSJ9.eyJpc3MiOiJodHRwczovL3RoZXNpcy1tYW5hZ2VtZW50LTA5LmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2NTY0ZjgzYTAyMmY2YjIwODNiNmI4YzkiLCJhdWQiOlsiaHR0cHM6Ly90aGVzaXMtbWFuYWdlbWVudC0wOS5ldS5hdXRoMC5jb20vYXBpL3YyLyIsImh0dHBzOi8vdGhlc2lzLW1hbmFnZW1lbnQtMDkuZXUuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTcwMTI4MzE1MywiZXhwIjoxNzAxMzY5NTUzLCJhenAiOiJvNUkxUU5UQUJ3Ylg2ZzF4YzJseG90YTlhWlFFc092QSIsInNjb3BlIjoib3BlbmlkIHJlYWQ6Y3VycmVudF91c2VyIHVwZGF0ZTpjdXJyZW50X3VzZXJfbWV0YWRhdGEifQ.MWkwMZZMKPyu1Xxzx-YxE9wSzZuYMaNrph04FZEaNyO3AX32Ovjnx5T9Y1-S_xUv2QPWMWsZJuWuycRDZOQRzhRplU9-S4aforzSZPDHMqWzASRqSGfyAfxKc-RX36zd6TPRxLpFcd5IrlkkJ_VxsjbuNXW1Lt1M-X4XKBIWicXWtIBvVPsVyUjZRA00FnmmsX2kjutiWJ21kaIcp1rqlNvcS7RdoBR8q_wxan81SIHObMZLX45hds1nJfnjVyOzw0ZqjUFXSb00P8qiy70Un6a1VcqMtqmpaeagfOheRJ6_z311O5W3mH5vG3C2CbFJPShcPAPgTSSRRUuvEEZVwg";
const studentAccessToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imt4VHlraUVwT05RRnYxZG4tc2JXVSJ9.eyJpc3MiOiJodHRwczovL3RoZXNpcy1tYW5hZ2VtZW50LTA5LmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2NTYzNWQwMzZkODc3MjliNmIzZmZlODMiLCJhdWQiOlsiaHR0cHM6Ly90aGVzaXMtbWFuYWdlbWVudC0wOS5ldS5hdXRoMC5jb20vYXBpL3YyLyIsImh0dHBzOi8vdGhlc2lzLW1hbmFnZW1lbnQtMDkuZXUuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTcwMTI4OTAyNywiZXhwIjoxNzAxMzc1NDI3LCJhenAiOiJvNUkxUU5UQUJ3Ylg2ZzF4YzJseG90YTlhWlFFc092QSIsInNjb3BlIjoib3BlbmlkIHJlYWQ6Y3VycmVudF91c2VyIHVwZGF0ZTpjdXJyZW50X3VzZXJfbWV0YWRhdGEifQ.fNl9K0uZHNWOIbiWQ4VINR6HprQbxpGwXn2UNTm7Wuqgh5a7lmBr-cdMmD3D2Im1mXEyB6YS9V6L9BI0YK7Cp7AB9fsUSNb2kmM2KqMgbbEemKfONm8czAj5e34wO-uQEn5J8JEWdrV8pHPnglzNy_AMKkZH_I-EHMxJLmIRJXxPxxfge5yno7r7WQKxvaklq3w5CFv0YDd0thLlHxz5swu2Ag1SE3Md7dmxBrNShGRGuCU882mN87aewzVIH6bfEo02m92lPIj3h272IZH3uW9ow8ZkkY9GIA4DThnF8eZiaUe8caruO06ClDjM6BuiJLCE41nfZSCJQ_nKMzm17g"

describe('GET /users', () => {
  test('should return user information with valid authentication', async () => {
    // Mock getUserInfo function
    jest.spyOn(usersDao, 'getUserInfo').mockResolvedValue({ id: 'd12345', name: 'mockName' });

    // Make a request to the endpoint
    const response = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${teacherAccessToken}`);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 'd12345', name: 'mockName' });
  });

  test('should return 503 error with invalid authentication', async () => {
    // Mock getUserInfo function to simulate an error
    jest.spyOn(usersDao, 'getUserInfo').mockRejectedValue(new Error('Simulated error'));

    // Make a request to the endpoint
    const response = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${teacherAccessToken}`);

    // Assertions
    expect(response.status).toBe(503);
    expect(response.body).toBe('error retrieving user info');
  });
});
    