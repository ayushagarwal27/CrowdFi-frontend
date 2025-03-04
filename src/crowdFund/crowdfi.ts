/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/crowdfi.json`.
 */
export type Crowdfi = {
  address: "GMvQJy82KJryDR6nk2WEti4oYTLJjFKH2EbsdSjtgSMu";
  metadata: {
    name: "crowdfi";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "closeCampaign";
      discriminator: [65, 49, 110, 7, 63, 238, 206, 77];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "config";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 111, 110, 102, 105, 103];
              },
              {
                kind: "account";
                path: "config.seed";
                account: "config";
              }
            ];
          };
        },
        {
          name: "campaign";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 97, 109, 112, 97, 105, 103, 110];
              },
              {
                kind: "account";
                path: "campaign.title";
                account: "campaign";
              },
              {
                kind: "account";
                path: "campaign.admin";
                account: "campaign";
              }
            ];
          };
        },
        {
          name: "campaignVault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ];
              },
              {
                kind: "account";
                path: "campaign";
              }
            ];
          };
        },
        {
          name: "campaignRewardMint";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [114, 101, 119, 97, 114, 100, 95, 109, 105, 110, 116];
              },
              {
                kind: "account";
                path: "campaign";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "tokenProgram";
        }
      ];
      args: [];
    },
    {
      name: "createCampaign";
      discriminator: [111, 131, 187, 98, 160, 193, 114, 244];
      accounts: [
        {
          name: "admin";
          writable: true;
          signer: true;
        },
        {
          name: "config";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 111, 110, 102, 105, 103];
              },
              {
                kind: "account";
                path: "config.seed";
                account: "config";
              }
            ];
          };
        },
        {
          name: "campaign";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 97, 109, 112, 97, 105, 103, 110];
              },
              {
                kind: "arg";
                path: "title";
              },
              {
                kind: "account";
                path: "admin";
              }
            ];
          };
        },
        {
          name: "vault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ];
              },
              {
                kind: "account";
                path: "campaign";
              }
            ];
          };
        },
        {
          name: "rewardMint";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [114, 101, 119, 97, 114, 100, 95, 109, 105, 110, 116];
              },
              {
                kind: "account";
                path: "campaign";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "tokenProgram";
        }
      ];
      args: [
        {
          name: "title";
          type: "string";
        },
        {
          name: "description";
          type: "string";
        },
        {
          name: "url";
          type: "string";
        },
        {
          name: "targetAmount";
          type: "u64";
        },
        {
          name: "startTimestamp";
          type: "u64";
        },
        {
          name: "endTimestamp";
          type: "u64";
        }
      ];
    },
    {
      name: "donate";
      discriminator: [121, 186, 218, 211, 73, 70, 196, 180];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "admin";
          writable: true;
        },
        {
          name: "campaignAdmin";
        },
        {
          name: "config";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 111, 110, 102, 105, 103];
              },
              {
                kind: "account";
                path: "config.seed";
                account: "config";
              }
            ];
          };
        },
        {
          name: "campaign";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 97, 109, 112, 97, 105, 103, 110];
              },
              {
                kind: "account";
                path: "campaign.title";
                account: "campaign";
              },
              {
                kind: "account";
                path: "campaignAdmin";
              }
            ];
          };
        },
        {
          name: "vault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ];
              },
              {
                kind: "account";
                path: "campaign";
              }
            ];
          };
        },
        {
          name: "rewardMint";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [114, 101, 119, 97, 114, 100, 95, 109, 105, 110, 116];
              },
              {
                kind: "account";
                path: "campaign";
              }
            ];
          };
        },
        {
          name: "donationInfo";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [100, 111, 110, 97, 116, 105, 111, 110];
              },
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "account";
                path: "campaign";
              }
            ];
          };
        },
        {
          name: "userRewardAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "rewardMint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "tokenProgram";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "initializeConfig";
      discriminator: [208, 127, 21, 1, 194, 190, 196, 70];
      accounts: [
        {
          name: "admin";
          writable: true;
          signer: true;
        },
        {
          name: "config";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 111, 110, 102, 105, 103];
              },
              {
                kind: "arg";
                path: "seed";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "seed";
          type: "u64";
        },
        {
          name: "maxDuration";
          type: "u64";
        },
        {
          name: "maxAmount";
          type: "u64";
        }
      ];
    },
    {
      name: "refund";
      discriminator: [2, 96, 183, 251, 63, 208, 46, 46];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "campaign";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 97, 109, 112, 97, 105, 103, 110];
              },
              {
                kind: "account";
                path: "campaign.title";
                account: "campaign";
              },
              {
                kind: "account";
                path: "campaign.admin";
                account: "campaign";
              }
            ];
          };
        },
        {
          name: "vault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ];
              },
              {
                kind: "account";
                path: "campaign";
              }
            ];
          };
        },
        {
          name: "rewardMint";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [114, 101, 119, 97, 114, 100, 95, 109, 105, 110, 116];
              },
              {
                kind: "account";
                path: "campaign";
              }
            ];
          };
        },
        {
          name: "donationInfo";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [100, 111, 110, 97, 116, 105, 111, 110];
              },
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "account";
                path: "campaign";
              }
            ];
          };
        },
        {
          name: "userRewardAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "rewardMint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "tokenProgram";
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "updateCampaign";
      discriminator: [235, 31, 39, 49, 121, 173, 19, 92];
      accounts: [
        {
          name: "admin";
          writable: true;
          signer: true;
        },
        {
          name: "campaign";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 97, 109, 112, 97, 105, 103, 110];
              },
              {
                kind: "account";
                path: "campaign.title";
                account: "campaign";
              },
              {
                kind: "account";
                path: "campaign.admin";
                account: "campaign";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "description";
          type: {
            option: "string";
          };
        },
        {
          name: "url";
          type: {
            option: "string";
          };
        }
      ];
    }
  ];
  accounts: [
    {
      name: "campaign";
      discriminator: [50, 40, 49, 11, 157, 220, 229, 192];
    },
    {
      name: "config";
      discriminator: [155, 12, 170, 224, 30, 250, 204, 130];
    },
    {
      name: "donation";
      discriminator: [189, 210, 54, 77, 216, 85, 7, 68];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "customError";
      msg: "Custom Error";
    },
    {
      code: 6001;
      name: "campaignTargetNotMet";
      msg: "Campaign has not met it target";
    },
    {
      code: 6002;
      name: "campaignIsCompleted";
      msg: "Campaign has been completed already";
    },
    {
      code: 6003;
      name: "campaignTitleIsTooLong";
      msg: "Campaign Title is Too Long";
    },
    {
      code: 6004;
      name: "campaignDescriptionIsTooLong";
      msg: "Campaign Description is Too Long";
    },
    {
      code: 6005;
      name: "campaignUrlIsTooLong";
      msg: "Campaign URL is Too Long";
    }
  ];
  types: [
    {
      name: "campaign";
      type: {
        kind: "struct";
        fields: [
          {
            name: "admin";
            type: "pubkey";
          },
          {
            name: "config";
            type: "pubkey";
          },
          {
            name: "title";
            type: "string";
          },
          {
            name: "description";
            type: "string";
          },
          {
            name: "url";
            type: "string";
          },
          {
            name: "startTimestamp";
            type: "u64";
          },
          {
            name: "endTimestamp";
            type: "u64";
          },
          {
            name: "targetAmount";
            type: "u64";
          },
          {
            name: "currentAmount";
            type: "u64";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "vaultBump";
            type: "u8";
          },
          {
            name: "rewardMintBump";
            type: "u8";
          },
          {
            name: "isCompleted";
            type: "bool";
          }
        ];
      };
    },
    {
      name: "config";
      type: {
        kind: "struct";
        fields: [
          {
            name: "admin";
            type: "pubkey";
          },
          {
            name: "maxDuration";
            type: "u64";
          },
          {
            name: "maxAmount";
            type: "u64";
          },
          {
            name: "fee";
            type: "u16";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "seed";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "donation";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "pubkey";
          },
          {
            name: "amount";
            type: "u64";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    }
  ];
};
