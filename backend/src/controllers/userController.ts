import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

const _token = "ntn_b10296201043GsFXybAC9zgtsUe7SEPPravIZUzWsM7fhF";
const _db_id = "1d203d5ec1888072aad8e1f380296772";

const notion = axios.create({
  baseURL: "https://api.notion.com/v1",
  headers: {
    Authorization: `Bearer ${_token}`,
    "Notion-Version": "2022-06-28",
  },
});

// Get users
export const getUsers = async (_req: Request, res: Response) => {
  const { data } = await notion.post(`/databases/${_db_id}/query`);
  console.log(data);

  const users = data.results.map((user: any) => ({
    id: user.id,
    name: user.properties.Name.title[0]?.text.content,
    email: user.properties.Email.email,
    password: user.properties.Password.rich_text[0]?.text.content,
    age: user.properties.Age.number,
    role: user.properties.Role.rich_text[0]?.text.content,
    recommend: user.properties.Recommend.rich_text[0]?.text.content,
    feature: user.properties.Feature.rich_text[0]?.text.content,
    comments: user.properties.Comments.rich_text[0]?.text.content,
    permmission: user.properties.Permmission.rich_text[0]?.text.content,
  }));
  res.json(users);
};

// Create User
export const createUser = async (req: Request, res: Response) => {
  const {
    name,
    email,
    password,
    age,
    role,
    recommend,
    feature,
    comments,
    permmission,
  } = req.body;
  if (
    !name ||
    !email /*|| !password*/ ||
    !age ||
    !role ||
    !recommend ||
    !feature ||
    !comments
  ) {
    res.status(400).json({
      error:
        "Please provide name, email, role, age, recommend, feature, and comments.",
    });
  } else {
    try {
      // 👇 Query Notion for existing email
      const queryResponse = await notion.post(`/databases/${_db_id}/query`, {
        filter: {
          property: "Email",
          email: {
            equals: email,
          },
        },
      });

      if (queryResponse.data.results.length > 0) {
        res.status(400).json({ error: "Email already exists." });
      } else {
        // 👇 If no duplicate, proceed with creation
        await notion.post("/pages", {
          parent: { database_id: _db_id },
          properties: {
            Name: { title: [{ text: { content: name } }] },
            Email: { email: email },
            Password: { rich_text: [{ text: { content: name } }] },
            Age: { number: age },
            Role: { rich_text: [{ text: { content: role } }] },
            Recommend: { rich_text: [{ text: { content: recommend } }] },
            Feature: { rich_text: [{ text: { content: feature } }] },
            Comments: { rich_text: [{ text: { content: comments } }] },
            Permmission: { rich_text: [{ text: { content: "un_user" } }] }, // เพิ่ม Position เป็น "user"
          },
        });
        res.status(201).json({ message: "User created" });
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  }
};

// Update User
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params; // แยก ID จากพารามิเตอร์คำขอ
  const {
    name,
    email,
    password,
    age,
    role,
    recommend,
    feature,
    comments,
    permmission,
  } = req.body;
  await notion.patch(`/pages/${id}`, {
    properties: {
      Name: { title: [{ text: { content: name } }] },
      Email: { email: email },
      Password: { rich_text: [{ text: { content: password } }] },
      Age: { number: age },
      Role: { rich_text: [{ text: { content: role } }] },
      Recommend: { rich_text: [{ text: { content: recommend } }] },
      Feature: { rich_text: [{ text: { content: feature } }] },
      Comments: { rich_text: [{ text: { content: comments } }] }, // เพิ่ม Comments
      Permmission: { rich_text: [{ text: { content: permmission } }] }, // เพิ่ม Position เป็น "user"
    },
  });
  res.json({ message: "User updated" });
};

// Login User
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log(password);
  try {
    const { data } = await notion.post(`/databases/${_db_id}/query`, {
      filter: {
        and: [
          {
            property: "Email",
            email: {
              equals: email,
            },
          },
          {
            property: "Password",
            rich_text: {
              equals: password,
            },
          },
        ],
      },
    });
    if (data.results.length > 0) {
      const user = data.results.map((user: any) => ({
        id: user.id,
        name: user.properties.Name.title[0]?.text.content,
        email: user.properties.Email.email,
        role: user.properties.Role.rich_text[0]?.text.content,
        age: user.properties.Age.number,
        recommend: user.properties.Recommend.rich_text[0]?.text.content,
        feature: user.properties.Feature.rich_text[0]?.text.content,
        comments: user.properties.Comments.rich_text[0]?.text.content,
        permmission: user.properties.Permmission.rich_text[0]?.text.content,
      }))[0];

      res.json({ status: "OK", data: user });
    } else {
      res.json({ status: "LOGIN_FAIL", data: {} });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: "ERROR", data: {} });
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
  // const { id } = req.params;
  // await notion.patch(`/pages/${id}`, { archived: true });
  // res.json({ message: 'User deleted' });
  const { id } = req.params;
  await notion.patch(`/pages/${id}`, { archived: true });
  res.json({ message: "User deleted" });
};

export const updateByUser = async (req: Request, res: Response) => {
  const { id } = req.params; // แยก ID จากพารามิเตอร์คำขอ
  const { name, email, password, age, role, recommend, feature, comments } =
    req.body;
  await notion.patch(`/pages/${id}`, {
    properties: {
      Name: { title: [{ text: { content: name } }] },
      Email: { email: email },
      Password: { rich_text: [{ text: { content: password } }] },
      Age: { number: age },
      Role: { rich_text: [{ text: { content: role } }] },
      Recommend: { rich_text: [{ text: { content: recommend } }] },
      Feature: { rich_text: [{ text: { content: feature } }] },
      Comments: { rich_text: [{ text: { content: comments } }] }, // เพิ่ม Comments
    },
  });
  res.json({ message: "User updated" });
};


const getPageById = async (pageId: string) => {
  try {
    const { data } = await notion.get(`/pages/${pageId}`);
    console.log("Page data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching page by ID:");
    throw error;
  }
};

export const checkUser = async (req: Request, res: Response) => {
  const { userid } = req.body;

  console.log(userid);
  try {
    const page = await getPageById(userid);
    console.log(page)
    
    const properties = page.properties;

    const user = {
      id: page.id,
      name: properties.Name?.title?.[0]?.text?.content || "",
      email: properties.Email?.email || "",
      role: properties.Role?.rich_text?.[0]?.text?.content || "",
      age: properties.Age?.number || null,
      recommend: properties.Recommend?.rich_text?.[0]?.text?.content || "",
      feature: properties.Feature?.rich_text?.[0]?.text?.content || "",
      comments: properties.Comments?.rich_text?.[0]?.text?.content || "",
      permmission: properties.Permmission?.rich_text?.[0]?.text?.content || "",
    };

    res.json({ status: "OK", data: user});
  } catch (error) {
    console.log(error);
    res.json({ status: "ERROR", data: {} });
  }
};
