"use server";

type CreateKommerSessionResponse =
  | { status: "success"; data: string }
  | { status: "error"; error: string };
export const createKommerSession = async () => {
  try {
    const username = process.env.KOMMER_LOGIN;
    const password = process.env.KOMMER_PASS;

    const loginResponse = await fetch(
      "http://bramki.zs1mm.local/accounts/login/",
      {
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
      }
    );

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

export const getKommerUsers = async (page: number) => {
  try {
    const sessionId = await createKommerSession();
    console.log(sessionId)

    if (sessionId.status === "error") return []

    const response = await fetch(
      `http://bramki.zs1mm.local/data/personnel/Employee/?o=PIN,DeptID__code,lastname,Card,EName&stamp=1742644737380&p=${page}&l=15&mnp=15&`,
      {
        method: "POST",
        headers: {
          Cookie: `sessionidadms=${sessionId.data}`,
        },
        credentials: "include",
      }
    );

    console.log(response);

    if (!response.ok) return []
    
    
  } catch (error) {
    console.log(error)
    return []
  }
};
