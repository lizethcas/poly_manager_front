import { describe, it, expect, vi, beforeEach } from "vitest";
import { axiosDashboard, axiosChat } from "./axios.config";

describe("Axios Config", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("process", { env: { NODE_ENV: "development" } });
    vi.stubGlobal("localStorage", localStorageMock);
  });

  const localStorageMock = {
    store: {} as Record<string, string>,
    getItem: vi.fn((key: string) => localStorageMock.store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      localStorageMock.store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      localStorageMock.store = {};
    }),
  };

  describe("axiosDashboard", () => {
    it("debe tener la URL base correcta en desarrollo", async () => {
      vi.doMock("axios", () => ({
        default: {
          create: vi.fn().mockReturnValue({
            defaults: { baseURL: "http://localhost:8000/dashboard/api/" },
            interceptors: {
              request: { use: vi.fn(), handlers: [], eject: vi.fn() },
            },
          }),
        },
      }));
      const { axiosDashboard } = await import("./axios.config");
      expect(axiosDashboard.defaults.baseURL).toBe(
        "http://localhost:8000/dashboard/api/"
      );
    });

    it("debe tener la URL base correcta en producción", async () => {
      vi.stubGlobal("process", { env: { NODE_ENV: "production" } });
      vi.doMock("axios", () => ({
        default: {
          create: vi.fn().mockReturnValue({
            defaults: {
              baseURL: "https://dploy-production.up.railway.app/dashboard/api/",
            },
            interceptors: {
              request: { use: vi.fn(), handlers: [], eject: vi.fn() },
            },
          }),
        },
      }));
      const { axiosDashboard } = await import("./axios.config");
      expect(axiosDashboard.defaults.baseURL).toContain(
        "dploy-production.up.railway.app"
      );
    });

    describe("Interceptor de peticiones", () => {
      it("no debe agregar token para google-login", async () => {
        const config = { url: "google-login", headers: {} };
        const result =
          await axiosDashboard.interceptors.request.handlers?.[0]?.fulfilled?.(
            config
          );
        expect(result?.headers?.Authorization).toBeUndefined();
      });

      it("debe agregar el token Bearer para otras rutas", async () => {
        localStorage.setItem("token", "test-token");
        const config = { url: "other-endpoint", headers: {} };
        const result =
          await axiosDashboard.interceptors.request.handlers?.[0]?.fulfilled?.(
            config
          );
        expect(result?.headers?.Authorization).toBe("Bearer test-token");
      });
    });
  });

  describe("axiosChat", () => {
    it("debe tener la URL base correcta en desarrollo", async () => {
      vi.doMock("axios", () => ({
        default: {
          create: vi.fn().mockReturnValue({
            defaults: { baseURL: "http://localhost:8000/chat/" },
            interceptors: {
              request: { use: vi.fn(), handlers: [], eject: vi.fn() },
            },
          }),
        },
      }));
      const { axiosChat } = await import("./axios.config");
      expect(axiosChat.defaults.baseURL).toBe("http://localhost:8000/chat/");
    });

    it("debe tener la URL base correcta en producción", () => {
      vi.stubEnv("NODE_ENV", "production");
      expect(axiosChat.defaults.baseURL).includes(
        "dploy-production.up.railway.app"
      );
    });
  });
});
