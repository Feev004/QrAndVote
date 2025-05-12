"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUser = exports.updateByUser = exports.deleteUser = exports.loginUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const axios_1 = __importDefault(require("axios"));
const _token = "ntn_b10296201043GsFXybAC9zgtsUe7SEPPravIZUzWsM7fhF";
const _db_id = "1d203d5ec1888072aad8e1f380296772";
const notion = axios_1.default.create({
    baseURL: "https://api.notion.com/v1",
    headers: {
        Authorization: `Bearer ${_token}`,
        "Notion-Version": "2022-06-28",
    },
});
// Get users
const getUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield notion.post(`/databases/${_db_id}/query`);
    console.log(data);
    const users = data.results.map((user) => {
        var _a, _b, _c, _d, _e, _f, _g;
        return ({
            id: user.id,
            name: (_a = user.properties.Name.title[0]) === null || _a === void 0 ? void 0 : _a.text.content,
            email: user.properties.Email.email,
            password: (_b = user.properties.Password.rich_text[0]) === null || _b === void 0 ? void 0 : _b.text.content,
            age: user.properties.Age.number,
            role: (_c = user.properties.Role.rich_text[0]) === null || _c === void 0 ? void 0 : _c.text.content,
            recommend: (_d = user.properties.Recommend.rich_text[0]) === null || _d === void 0 ? void 0 : _d.text.content,
            feature: (_e = user.properties.Feature.rich_text[0]) === null || _e === void 0 ? void 0 : _e.text.content,
            comments: (_f = user.properties.Comments.rich_text[0]) === null || _f === void 0 ? void 0 : _f.text.content,
            permmission: (_g = user.properties.Permmission.rich_text[0]) === null || _g === void 0 ? void 0 : _g.text.content,
        });
    });
    res.json(users);
});
exports.getUsers = getUsers;
// Create User
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, age, role, recommend, feature, comments, permmission, } = req.body;
    if (!name ||
        !email /*|| !password*/ ||
        !age ||
        !role ||
        !recommend ||
        !feature ||
        !comments) {
        res.status(400).json({
            error: "Please provide name, email, role, age, recommend, feature, and comments.",
        });
    }
    else {
        try {
            // 👇 Query Notion for existing email
            const queryResponse = yield notion.post(`/databases/${_db_id}/query`, {
                filter: {
                    property: "Email",
                    email: {
                        equals: email,
                    },
                },
            });
            if (queryResponse.data.results.length > 0) {
                res.status(400).json({ error: "Email already exists." });
            }
            else {
                // 👇 If no duplicate, proceed with creation
                yield notion.post("/pages", {
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
        }
        catch (error) {
            res.status(500).json({ error });
        }
    }
});
exports.createUser = createUser;
// Update User
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // แยก ID จากพารามิเตอร์คำขอ
    const { name, email, password, age, role, recommend, feature, comments, permmission, } = req.body;
    yield notion.patch(`/pages/${id}`, {
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
});
exports.updateUser = updateUser;
// Login User
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(password);
    try {
        const { data } = yield notion.post(`/databases/${_db_id}/query`, {
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
            const user = data.results.map((user) => {
                var _a, _b, _c, _d, _e, _f;
                return ({
                    id: user.id,
                    name: (_a = user.properties.Name.title[0]) === null || _a === void 0 ? void 0 : _a.text.content,
                    email: user.properties.Email.email,
                    role: (_b = user.properties.Role.rich_text[0]) === null || _b === void 0 ? void 0 : _b.text.content,
                    age: user.properties.Age.number,
                    recommend: (_c = user.properties.Recommend.rich_text[0]) === null || _c === void 0 ? void 0 : _c.text.content,
                    feature: (_d = user.properties.Feature.rich_text[0]) === null || _d === void 0 ? void 0 : _d.text.content,
                    comments: (_e = user.properties.Comments.rich_text[0]) === null || _e === void 0 ? void 0 : _e.text.content,
                    permmission: (_f = user.properties.Permmission.rich_text[0]) === null || _f === void 0 ? void 0 : _f.text.content,
                });
            })[0];
            res.json({ status: "OK", data: user });
        }
        else {
            res.json({ status: "LOGIN_FAIL", data: {} });
        }
    }
    catch (error) {
        console.log(error);
        res.json({ status: "ERROR", data: {} });
    }
});
exports.loginUser = loginUser;
// Delete User
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { id } = req.params;
    // await notion.patch(`/pages/${id}`, { archived: true });
    // res.json({ message: 'User deleted' });
    const { id } = req.params;
    yield notion.patch(`/pages/${id}`, { archived: true });
    res.json({ message: "User deleted" });
});
exports.deleteUser = deleteUser;
const updateByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // แยก ID จากพารามิเตอร์คำขอ
    const { name, email, password, age, role, recommend, feature, comments } = req.body;
    yield notion.patch(`/pages/${id}`, {
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
});
exports.updateByUser = updateByUser;
const getPageById = (pageId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield notion.get(`/pages/${pageId}`);
        console.log("Page data:", data);
        return data;
    }
    catch (error) {
        console.error("Error fetching page by ID:");
        throw error;
    }
});
const checkUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
    const { userid } = req.body;
    console.log(userid);
    try {
        const page = yield getPageById(userid);
        console.log(page);
        const properties = page.properties;
        const user = {
            id: page.id,
            name: ((_d = (_c = (_b = (_a = properties.Name) === null || _a === void 0 ? void 0 : _a.title) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.text) === null || _d === void 0 ? void 0 : _d.content) || "",
            email: ((_e = properties.Email) === null || _e === void 0 ? void 0 : _e.email) || "",
            role: ((_j = (_h = (_g = (_f = properties.Role) === null || _f === void 0 ? void 0 : _f.rich_text) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.text) === null || _j === void 0 ? void 0 : _j.content) || "",
            age: ((_k = properties.Age) === null || _k === void 0 ? void 0 : _k.number) || null,
            recommend: ((_p = (_o = (_m = (_l = properties.Recommend) === null || _l === void 0 ? void 0 : _l.rich_text) === null || _m === void 0 ? void 0 : _m[0]) === null || _o === void 0 ? void 0 : _o.text) === null || _p === void 0 ? void 0 : _p.content) || "",
            feature: ((_t = (_s = (_r = (_q = properties.Feature) === null || _q === void 0 ? void 0 : _q.rich_text) === null || _r === void 0 ? void 0 : _r[0]) === null || _s === void 0 ? void 0 : _s.text) === null || _t === void 0 ? void 0 : _t.content) || "",
            comments: ((_x = (_w = (_v = (_u = properties.Comments) === null || _u === void 0 ? void 0 : _u.rich_text) === null || _v === void 0 ? void 0 : _v[0]) === null || _w === void 0 ? void 0 : _w.text) === null || _x === void 0 ? void 0 : _x.content) || "",
            permmission: ((_1 = (_0 = (_z = (_y = properties.Permmission) === null || _y === void 0 ? void 0 : _y.rich_text) === null || _z === void 0 ? void 0 : _z[0]) === null || _0 === void 0 ? void 0 : _0.text) === null || _1 === void 0 ? void 0 : _1.content) || "",
        };
        res.json({ status: "OK", data: user });
    }
    catch (error) {
        console.log(error);
        res.json({ status: "ERROR", data: {} });
    }
});
exports.checkUser = checkUser;
