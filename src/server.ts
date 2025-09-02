// import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
// import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
// import { z } from "zod";
// import fs from "node:fs/promises";
// import { boolean } from "zod/v4";
// import { CreateMessageRequestSchema, CreateMessageResultSchema } from "@modelcontextprotocol/sdk/types.js";

// const server = new McpServer({
//     name: "My MCP Server",
//     version: "1.0.0",
//     capabilities: {
//         resources: {},
//         tools: {},
//         prompts: {},
//     }
// });

// server.resource(
//     "users",
//     "users//all",
//     {
//         description: "Get all users",
//         title: "users",
//         mimeType : "application/json",
//     },
//     async uri => {
//         const users =await import("./data/users.json", { with: { type: "json" } }).then(m => m.default)


//         return {
//                 contents: [
//                     { uri : uri.href ,
//                         tex: JSON.stringify(users), mimeType: "application/json.", }
//                 ]
//             };
//     }
// )


// server.resource("user-details",new ResourceTemplate("users://{userId}/profile",{list: undefined}),

//     {
//         description: "Get a  user's details by ID",
//         title: "users",
//         mimeType : "application/json",
//     },
//     async (uri,{userId}) => {
//         const users =await import("./data/users.json", { with: { type: "json" } }).then(m => m.default)

//         const user = users.find(u => u.id === parseInt(userId as string));

//         if (user == null) {
//             return{
//                 contents: [
//                     { uri : uri.href ,
//                         text : JSON.stringify({ error: "User not found" }), mimeType: "application/json.", }
//                 ]
//             }
            
//         }
//         return {
//                 contents: [
//                     { uri : uri.href ,
//                         tex: JSON.stringify(users), mimeType: "application/json.", }
//                 ]
//             };
//     }
// )

// server.tool("create-remdom-user", "create aramdom user with fake data",{
//     title :"Create ramdom User",
//     (property)destructiveHints: boolean,
//      readonlyHints: false, destructiveHints : false, idempotentHints : false, openWorldHints : true,
// },
//     async () => {
//    const res = await server.server.request({
//         method: "sampling/createMessage",
//         params: {
//             messages: [
//                 { role: "user", content: {type: "text", text: "Generate a fake user profile. The user should have a realistic name, email, address, and phone number."} ,},
//             ],
//             maxTokens: 1200
//         },
//     },
//     CreateMessageResultSchema
//     )
//     if (res.content.type !== "text") {
//         return {
//             content: [
//                 { type: "text", text: "Failed to generate user profile" }
//             ]
//         };
//     }
//     try {
//         const fakeUser = JSON.parse(res.content.text.trim()
//         .replace(/^```json|, "")
//             .replace(/```$/,"")
//             .trim()
//         )

//      const id = await createUser(fakeUser);
//      return {
//         content: [
//             { type: "text", text: `User ${id} created successfully.` }
//         ]
//      };        
//     } catch  {
//       return {
//         content: [
//             { type: "text", text: "Failed to parse user profile" }
//         ]
//       };  
//     }
// })

// server.prompt("generate-fake-user", "Generates a fake user profile", { name: z.string() }, ({ name }) => {
//     return {
//         messages: [
//             { role: "user", content: {type: "text", text: `Generate a fake user profile for ${name}. The user should have a realistic email, address, and phone number.`} }
//         ]
//     };
// }
// // Function to read users from JSON file
// async function readUsers() {
//     try {
//         const data = await fs.readFile("./data/users.json", "utf8");
//         return JSON.parse(data);
//     } catch (error) {
//         console.error("Error reading users file:", error);
//         return [];
//     }
// }

// // Function to write users to JSON file
// async function writeUsers(users: any[]) {
//     try {
//         await fs.writeFile("./data/users.json", JSON.stringify(users, null, 2));
//     } catch (error) {
//         console.error("Error writing users file:", error);
//         throw error;
//     }
// }

// // Function to create a user
// async function createUser(user: {
//     name: string, 
//     email: string, 
//     address: string, 
//     phone: string
// }) {
//     const users = await readUsers();
//     const id = users.length + 1;
//     const newUser = { id, ...user };
//     users.push(newUser);
//     await writeUsers(users);
//     return id;
// }

// // Register the tool
// server.tool(
//     "create-user",
//     "Creates a new user in the database", 
//     {
//         name: z.string(),
//         email: z.string(),
//         address: z.string(),
//         phone: z.string()
//     },
//     {
//         title: "Create User",
//         readonlyHints: false,
//         destructiveHints: false,
//         idempotentHints: false,
//         openWorldHints: true,
//     }, 
//     async (params) => {
//         try {
//             const id = await createUser(params);
//             return {
//                 content: [
//                     { type: "text", text: `User ${id} created successfully.` }
//                 ]
//             };
//         } catch (error) {
//             console.error("Error creating user:", error);
//             return {
//                 content: [
//                     { type: "text", text: "Error creating user." }
//                 ]
//             };
//         }
//     }
// ); 

// async function main() {
//     const transport = new StdioServerTransport();
//     await server.connect(transport);
//     console.error("MCP Server running on stdio");
// }

// main()


import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "node:fs/promises";

const server = new McpServer({
    name: "My MCP Server",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
        prompts: {},
    }
});

// Function to read users from JSON file
async function readUsers() {
    try {
        const data = await fs.readFile("./data/users.json", "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading users file:", error);
        return [];
    }
}

// Function to write users to JSON file
async function writeUsers(users: any[]) {
    try {
        await fs.writeFile("./data/users.json", JSON.stringify(users, null, 2));
    } catch (error) {
        console.error("Error writing users file:", error);
        throw error;
    }
}

// Function to create a user
async function createUser(user: {
    name: string, 
    email: string, 
    address: string, 
    phone: string
}) {
    const users = await readUsers();
    const id = users.length > 0 ? Math.max(...users.map(u => u.id || 0)) + 1 : 1;
    const newUser = { id, ...user };
    users.push(newUser);
    await writeUsers(users);
    return id;
}

// Resource to get all users
server.resource(
    "users",
    "users://all",
    {
        description: "Get all users",
        title: "Users",
        mimeType: "application/json",
    },
    async (uri) => {
        try {
            const users = await readUsers();
            return {
                contents: [
                    { 
                        uri: uri.href,
                        text: JSON.stringify(users), 
                        mimeType: "application/json" 
                    }
                ]
            };
        } catch (error) {
            return {
                contents: [
                    { 
                        uri: uri.href,
                        text: JSON.stringify({ error: "Failed to read users" }), 
                        mimeType: "application/json" 
                    }
                ]
            };
        }
    }
);

// Resource to get specific user by ID
server.resource(
    "user-details",
    new ResourceTemplate("users://{userId}/profile", { list: undefined }),
    {
        description: "Get a user's details by ID",
        title: "User Details",
        mimeType: "application/json",
    },
    async (uri, { userId }) => {
        try {
            const users = await readUsers();
            const user = users.find(u => u.id === parseInt(userId as string));

            if (!user) {
                return {
                    contents: [
                        { 
                            uri: uri.href,
                            text: JSON.stringify({ error: "User not found" }), 
                            mimeType: "application/json" 
                        }
                    ]
                };
            }

            return {
                contents: [
                    { 
                        uri: uri.href,
                        text: JSON.stringify(user), 
                        mimeType: "application/json" 
                    }
                ]
            };
        } catch (error) {
            return {
                contents: [
                    { 
                        uri: uri.href,
                        text: JSON.stringify({ error: "Failed to read user" }), 
                        mimeType: "application/json" 
                    }
                ]
            };
        }
    }
);

// Register the create-user tool
server.tool(
    "create-user",
    "Creates a new user in the database", 
    {
        name: z.string(),
        email: z.string().email(),
        address: z.string(),
        phone: z.string()
    },
    {
        title: "Create User",
        readonlyHints: false,
        destructiveHints: false,
        idempotentHints: false,
        openWorldHints: true,
    }, 
    async (params) => {
        try {
            const id = await createUser(params);
            return {
                content: [
                    { type: "text", text: `User ${id} created successfully.` }
                ]
            };
        } catch (error) {
            console.error("Error creating user:", error);
            return {
                content: [
                    { type: "text", text: "Error creating user." }
                ]
            };
        }
    }
);

// Prompt for generating fake user
server.prompt(
    "generate-fake-user", 
    "Generates a fake user profile", 
    { name: z.string() }, 
    ({ name }) => {
        return {
            messages: [
                { 
                    role: "user", 
                    content: {
                        type: "text", 
                        text: `Generate a fake user profile for ${name}. The user should have a realistic email, address, and phone number. Return only valid JSON without any additional text.`
                    } 
                }
            ]
        };
    }
);

async function main() { const transport = new StdioServerTransport(); await server.connect(transport); }

main()