#include <napi.h>
#include <zlib.h>

static std::string ComputeEtag(const uint8_t* data, size_t len, bool weak) {
  if (len == 0) {
    return weak ? "W/\"0\"" : "\"0\"";
  }

  uint32_t crc = crc32(0L, Z_NULL, 0);
  crc = crc32(crc, reinterpret_cast<const Bytef*>(data), len);

  std::string value =
      "\"" + std::to_string(len) + "-" + std::to_string(crc) + "\"";
  return weak ? "W/" + value : value;
}

static std::string ComputeEtagFromArg(const Napi::Env& env,
                                      const Napi::Value& arg, bool weak) {
  if (arg.IsString()) {
    std::string s = arg.As<Napi::String>().Utf8Value();
    return ComputeEtag(reinterpret_cast<const uint8_t*>(s.data()), s.size(),
                       weak);
  }
  if (arg.IsBuffer()) {
    auto buf = arg.As<Napi::Buffer<uint8_t>>();
    return ComputeEtag(buf.Data(), buf.ByteLength(), weak);
  }
  Napi::TypeError::New(env, "argument must be a string or Buffer")
      .ThrowAsJavaScriptException();
  return {};
}

Napi::Value Etag(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() != 1) {
    Napi::Error::New(env, "There should be 1 argument provided")
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  return Napi::String::New(env, ComputeEtagFromArg(env, info[0], false));
}

Napi::Value WeakEtag(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() != 1) {
    Napi::Error::New(env, "There should be 1 argument provided")
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  return Napi::String::New(env, ComputeEtagFromArg(env, info[0], true));
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "etag"), Napi::Function::New<Etag>(env));
  exports.Set(Napi::String::New(env, "weakEtag"),
              Napi::Function::New<WeakEtag>(env));
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
