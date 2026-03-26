import { defineEventHandler, getRequestURL, proxyRequest } from "h3";

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  const path = url.pathname;
  if (!path.startsWith("/api")) {
    // 非 api 开头的请求，直接响应
    return;
  }
  const headers = getRequestHeaders(event);
  // 检查是否已经通过鉴权
  const passed = headers["x-auth-passed"];
  if (passed) {
    // 已通过鉴权，直接响应
    return;
  }
  const hasBody = ["POST", "PUT", "PATCH"].includes(event.method);
  const body = hasBody ? await readBody(event) : null;
  console.log("Request body: ", body);
  // api 开头的请求，通过 OpenResty 鉴权后转发
  const targetBase = "http://localhost:8080";
  const targetURL = targetBase + path + url.search;
  // const headers = getRequestHeaders(event);
  return proxyRequest(event, targetURL, {
    // headers,
  });
});
