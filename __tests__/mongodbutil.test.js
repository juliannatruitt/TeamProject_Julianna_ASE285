const { MongoClient, deserialize } = require("mongodb");
const { connect, create, read, update, delete_document } = require("../util/mongodbutil");

// Mocking the MongoClient
jest.mock("mongodb");

describe("MongoDB Functions", () => {
  let mockClient;
//create mocks to allow for testing
    beforeEach(() => {
        mockClient = {
            db: jest.fn().mockReturnThis(),
            collection: jest.fn().mockReturnThis(),
            insertOne: jest.fn(),
            close: jest.fn(),
            connect: jest.fn(),
            find: jest.fn().mockReturnThis(),
            toArray: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
        };
        MongoClient.mockReturnValue(mockClient)
    });
//clearing mocks to allow for re-use
  afterEach(() => {
    jest.clearAllMocks();
  });
//Test for connect
  describe("connect", () => {
    test("should connect to MongoDB", async () => {
     await connect("mongodb://localhost:27017");
      expect(mockClient.connect).toHaveBeenCalled();
      console.log(connect);
    });
  });
//Test for create
  describe("create", () => {
    test("should insert document into collection", async () => {
      const document = { name: "John", age: 30 };
      const mockReturnValue = {insertedId: 1};
      mockClient.db().collection().insertOne.mockReturnValueOnce(mockReturnValue);

      const result = await create("mongodb://localhost:27017", "testDB", "testCollection", document);
      expect(mockClient.db).toHaveBeenCalledWith("testDB");
      expect(mockClient.db().collection).toHaveBeenCalledWith("testCollection");
      expect(mockClient.db().collection().insertOne).toHaveBeenCalledWith(document);
      expect(mockClient.close).toHaveBeenCalled();
      expect(result).toEqual(mockReturnValue);
    });
  });
 //Test for read
  describe("read", () => {
    test("should read documents from collection", async () => {
      const query = { age: { $gte: 25 } };
      const expectedResult = [{ name: "John", age: 30 }];
      mockClient.db().collection().find().toArray.mockReturnValueOnce(expectedResult);

      const result = await read("mongodb://localhost:27017", "testDB", "testCollection", query);
      expect(mockClient.db).toHaveBeenCalledWith("testDB");
      expect(await mockClient.db().collection).toHaveBeenCalledWith("testCollection");
      expect(mockClient.db().collection().find).toHaveBeenCalledWith(query);
      expect(mockClient.db().collection().find().toArray).toHaveBeenCalled();
      expect(mockClient.close).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  //test for update 
  describe("update", () => {
    test("should update documents from collection", async () =>{
        const query = {name: "John"};
        const newUpdate = {name: "Jane"};
        const object = {modifiedCount: 1};
        mockClient.db().collection().updateOne.mockReturnValueOnce(object);

        const result = await update("mongodb://localhost27017", "testDB", "testCollection", query, newUpdate);
        expect(mockClient.db).toHaveBeenCalledWith("testDB");
        expect(await mockClient.db().collection).toHaveBeenCalledWith("testCollection");
        expect(mockClient.db().collection().updateOne).toHaveBeenCalledWith(query, newUpdate);
        expect(mockClient.close).toHaveBeenCalled();
        expect(result).toEqual(object);
  });
});
  
  //test for delete_document 
  describe("delete_document", () =>{
    test("should delete document from collection", async() =>{
        const query ={name: "John"};
        const object = {deletedCount: 1};
        mockClient.db().collection().deleteOne.mockReturnValueOnce(object);

        const result = await delete_document("mongodb://localhost27017", "testDB", "testCollection", query);
        expect(mockClient.db).toHaveBeenCalledWith("testDB");
        expect(await mockClient.db().collection).toHaveBeenCalledWith("testCollection");
        expect(mockClient.db().collection().deleteOne).toHaveBeenCalledWith(query);
        expect(mockClient.close).toHaveBeenCalled();
        expect(result).toEqual(object);
    })
  })

})