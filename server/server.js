import {
  Server,
  loadPackageDefinition,
  ServerCredentials,
  status,
} from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
//import asd from '../proto/test.proto';

const user_db = {
  jhon01: {
    username: "jhon01",
    age: 20,
    mobile_no: "14563214521",
    email: "u1@gmail.com",
    hobbies: ['coding', 'swimming'],
    address: {
      addressLine_1: '373 Ganesh Nagar',
      addressLine_2: 'changodar',
      pincode: 382213
    }
  },
  jhon02: {
    age: 21,
    mobile_no: "14563214521",
    email: "u2@gmail.com",
    hobbies: ['coding', 'swimming'],
    address: {
      addressLine_1: '373 Ganesh Nagar',
      addressLine_2: 'changodar',
      pincode: 382213
    }
  },
  jhon03: {
    age: 22,
    mobile_no: "14563214521",
    email: "u3@gmail.com",
    hobbies: ['coding', 'swimming'],
    address: {
      addressLine_1: '373 Ganesh Nagar',
      addressLine_2: 'changodar',
      pincode: 382213
    }
  },
};

function getTest(call, callback) {
  console.log("<><>", call.request);
  let recipe = {
    knumber: String(call.request.id),
    type_operation: "01",
    subtype: 2,
    sum_operation: "03",
    paymenttypes: "04",
  };
  if (recipe) {
    console.log('recipe to be send', recipe)
    callback(null, recipe);
  } else {
    callback({
      message: "Recipe not found",
      code: status.INVALID_ARGUMENT,
    });
  }
}

function userInfo(call, callback) {
  console.log("--->", call.request, callback);
  const username = call.request.username;
  let response = user_db[username];
  if (response) {
    console.log("res to be send", response);
    callback(null, response);
  } else {
    console.log("falling...")
    callback({
      message: "No user find with username " + username,
      code: status.INVALID_ARGUMENT,
    });
  }
}

function main() {
  const definition = loadSync("../proto/test.proto");
  const testingProto = loadPackageDefinition(definition);

  const server = new Server();
  server.addService(testingProto.testingService.service, {
    getTest: getTest,
    userInfo: userInfo,
  });
  server.bindAsync(
    "0.0.0.0:50051",
    ServerCredentials.createInsecure(),
    (error, port) => {
      console.log(`listening on port ${port}`);
      server.start();
    }
  );
}

main();
