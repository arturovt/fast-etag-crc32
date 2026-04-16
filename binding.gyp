{
'targets': [
    {
      'target_name': 'fast_etag_crc32',
      'include_dirs': [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      'dependencies': [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      'sources': [
        'src/fast_etag_crc32.cc'
      ],
      'cflags_cc': ['-std=c++17', '-O3', '-msse4.2', '-Wall', '-Wextra'],
      'defines': ['NAPI_DISABLE_CPP_EXCEPTIONS', 'NDEBUG'],
    }
  ]
}
