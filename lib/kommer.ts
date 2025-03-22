"use server";

import { getUser } from "./user";

type CreateKommerSessionResponse =
  | { status: "success"; data: string }
  | { status: "error"; error: string };

const url = process.env.KOMMER_URL;

export const createKommerSession = async () => {
  try {

    const user = await getUser()
    if(!user || !user.permissions.can_see_kommer_section) return {
      status: "error",
      error: "You do not have permissions for it",
    } as CreateKommerSessionResponse
    
    const username = process.env.KOMMER_LOGIN;
    const password = process.env.KOMMER_PASS;

    const loginResponse = await fetch(`${url}accounts/login/`, {
      method: "POST",
      headers: {
        Accept: "text/html, */*",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/x-www-form-urlencoded",
        Connection: "keep-alive",
      },
      body: new URLSearchParams({
        username: username as string,
        password: password as string,
      }),
    });

    if (!loginResponse.ok) {
      const ans: CreateKommerSessionResponse = {
        status: "error",
        error: "Something went wrong",
      };
      return ans;
    }

    const setCookieHeader = loginResponse.headers.get("Set-Cookie");
    if (!setCookieHeader) {
      const ans: CreateKommerSessionResponse = {
        status: "error",
        error: "Something went wrong with cookies",
      };
      return ans;
    }

    const sessionMatch = /sessionidadms=([^;]+)/.exec(setCookieHeader);
    if (!sessionMatch) {
      const ans: CreateKommerSessionResponse = {
        status: "error",
        error: "Something went wrong with login cookies",
      };
      return ans;
    }

    const sessionId = sessionMatch[1];

    return {
      status: "success",
      data: sessionId,
    } as CreateKommerSessionResponse;
  } catch (error) {
    return {
      status: "error",
      error: "Something went wrong with login cookies",
    } as CreateKommerSessionResponse;
  }
};

export const getKommerUsers = async (page: number, PIN?: string, fname?: string, lname?: string, cardid?: string, group?: string) => {
  try {
    const sessionId = await createKommerSession();

    if (sessionId.status === "error") return {
      users: [],
      pageCount: 0,
      currentPage: 0,
    };

    const response = await fetch(
      `${url}data/personnel/Employee/?o=PIN,DeptID__code,lastname,Card,EName&stamp=1742644737380${group && `&DeptID__name__icontains=${group}`}${cardid && `&Card__icontains=${cardid}`}${PIN && `&PIN__icontains=${PIN}`}${lname && `&lastname__icontains=${lname}`}${fname && `&EName__icontains=${fname}`}&p=${page}&l=15&mnp=15&`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: `sessionidadms=${sessionId.data}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) return {
      users: [],
      pageCount: 0,
      currentPage: 0,
    };

    const textResponse = await response.text();
    const fixedResponse = textResponse
      .replace(/([{,])(\s*)([a-zA-Z0-9_]+)(\s*):/g, '$1"$3":')
      .replace(/'/g, '"');

    const jsonResponse = JSON.parse(fixedResponse);

    const users = jsonResponse.data.map((row: any[]) => {
      return {
        id: row[0],
        employeeNumber: row[1],
        firstName: row[2],
        lastName: row[3],
        departmentNumber: row[4],
        departmentName: row[5],
        gender: row[6],
        presenceZone: row[7],
        fingerprintCount: row[8],
        cardNumber: row[9],
        workPhone: row[10],
        additionalId: row[11],
        photo: row[12],
        validityDate: row[13],
        description: row[14],
      };
    });

    return {
      users,
      pageCount: jsonResponse.page_count || 0,
      currentPage: jsonResponse.current_page || 0,
    };
  } catch (error) {
    console.log(error);
    return {
      users: [],
      pageCount: 0,
      currentPage: 0,
    };
  }
};

export const updateKommerUser = async () => {
  try {
    const sessionId = await createKommerSession();

    if (sessionId.status === "error") return [];

    const formData = new URLSearchParams();
    formData.append("pk", "11154");
    formData.append("lng", "en");
    formData.append("tcount", "0");
    formData.append("fpcode", "");
    formData.append("PIN", "000003082");
    formData.append("City", "3INB111");
    formData.append("install_language", "en");
    formData.append("EName", "Kacper");
    formData.append("lastname", "Bajer");
    formData.append("card_number_type", "2");
    formData.append("Card", "12177117");
    formData.append("DeptID", "9");
    formData.append("Hiredday", "03/13/2025");
    formData.append("selfpassword", "123456");
    formData.append("delflag", "1");
    formData.append("acc_super_auth", "0");
    formData.append("level", "1");

    const response = await fetch(
      `${url}data/personnel/Employee/11154/?virtual_app=personnel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: `sessionidadms=${sessionId.data}`,
        },
        credentials: "include",
        body: formData.toString(),
      }
    );

    if (!response.ok) return [];
    const textResponse = await response.text();

    console.log(textResponse);
  } catch (error) {
    console.log(error);
  }
};

export const createKommerUser = async () => {
  const sessionId = await createKommerSession();

  if (sessionId.status === "error") return [];

  const formData = new URLSearchParams();
  formData.append("pk", "");
  formData.append("lng", "en");
  formData.append("tcount", "0");
  formData.append("fpcode", "");
  formData.append("PIN", "7778");
  formData.append("City", "");
  formData.append("install_language", "en");
  formData.append("EName", "3");
  formData.append("lastname", "1");
  formData.append("card_number_type", "2");
  formData.append("DeptID", "1");
  formData.append("Hiredday", "03/22/2025");
  formData.append("selfpassword", "123456");
  formData.append("delflag", "1");
  formData.append("acc_super_auth", "0");
  formData.append("level", "1");
  formData.append("level_changed", "1");

  try {
    const response = await fetch(
      `${url}data/personnel/Employee/_new_/?_lock=1`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: `sessionidadms=${sessionId.data}`,
        },
        credentials: "include",
        body: formData.toString(),
      }
    );

    if (!response.ok) return [];
    const textResponse = await response.text();

    console.log(textResponse);
  } catch (error) {
    console.log(error);
  }
};

export const deleteKommerUser = async () => {
  const sessionId = await createKommerSession();

  if (sessionId.status === "error") return [];

  try {
    const response = await fetch(
      `${url}data/personnel/Employee/_op_/_delete/?K=12704`,
      {
        method: "POST",
        headers: {
          Cookie: `sessionidadms=${sessionId.data}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) return [];
    const textResponse = await response.text();

    console.log(textResponse);
  } catch (error) {
    console.log(error);
  }
};

const errUserRes = {
  EName: null,
  PIN: null,
  lastname: null,
  Card: null,
  City: null,
  identitycard: null,
  Tele: null,
  FPHONE: null,
  Mobile: null,
  Birthday: null,
  email: null,
  Hiredday: null,
  homeaddress: null,
  Address: null,
  Gender: null,
  acc_super_auth: null,
  card_number_type: null,
  Password: null,
  delayed_door_open: null,
  selfpassword: null,
  level_name: null,
  hiretype: null,
  emptype: null
};

export const getKommerUser = async (id: string) => {
  try {
    const sessionId = await createKommerSession();

    if (sessionId.status === "error") return errUserRes

    const response = await fetch(
      `${url}data/personnel/Employee/${id}/?virtual_app=personnel&stamp=1742651044272&_=1742651044272`,
      {
        method: "GET",
        headers: {
          Cookie: `sessionidadms=${sessionId.data}`,
        },
        credentials: "include",
      }
    ); 

    if (!response.ok) return errUserRes

    const textResponse = await response.text();

    const extractValue = (name: string) => {
      const match = textResponse.match(
        new RegExp(`<input[^>]+name=["']${name}["'][^>]+value=["']([^"']+)["']`)
      );
      return match ? match[1] : null;
    };

    const extractSelectedOption = (name: string) => {
      const match = textResponse.match(new RegExp(`<select[^>]+name=["']${name}["'][^>]*>[\\s\\S]*?<option[^>]+value=["']([^"']+)["'][^>]*selected`, "i"));
      return match ? match[1] : null;
    };

    const data = {
      EName: extractValue("EName"),
      PIN: extractValue("PIN"),
      lastname: extractValue("lastname"),
      Card: extractValue("Card"),
      City: extractValue("City"),
      identitycard: extractValue("identitycard"),
      Tele: extractValue("Tele"),
      FPHONE: extractValue("FPHONE"),
      Mobile: extractValue("Mobile"),
      Birthday: extractValue("Birthday"),
      email: extractValue("email"),
      Hiredday: extractValue("Hiredday"),
      homeaddress: extractValue("homeaddress"),
      Address: extractValue("Address"),
      Gender: extractValue("Gender"),
      acc_super_auth: extractValue("acc_super_auth"),
      card_number_type: extractSelectedOption("card_number_type") === '2' ? 'Kod karty (DEC)' : 'Site Code+CardNO(000,00000)',
      Password: extractValue('Password'),
      delayed_door_open: extractValue('delayed_door_open'),
      selfpassword: extractValue('selfpassword'),
      level_name: extractValue('level_name'),
      hiretype: extractSelectedOption('hiretype') === '1' ? "Yes" : "No",
      emptype: extractSelectedOption('emtype') === '1' ? 'Stały' : extractSelectedOption('emtype') === '2' ? "Tymczasowy" : null,
    };

    return data;
  } catch (error) {
    console.log(error);
    return errUserRes
  }
};
export const getPermissions = async (PIN: string) => {
  try {
    const sessionId = await createKommerSession();

    if (sessionId.status === "error") return false
    const response = await fetch(
      `${url}iaccess/GetData/?func=selected_level&key=${PIN}`,
      {
        method: "GET",
        headers: {
          Cookie: `sessionidadms=${sessionId.data}`,
        },
        credentials: "include",
      }
    ); 

    if (!response.ok) return false
    const textResponse = await response.text();
    const jsonResponse = JSON.parse(textResponse)
    return jsonResponse.includes(1)
  } catch (error) {
    console.log(error)
    return false
  }
}