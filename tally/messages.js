const create_export_request = (header, body) => {
  return {
    'ENVELOPE': {
      'HEADER': header,
      'BODY': body
    }
  }
}

const get_export_data_header = () => {
  return {
    TALLYREQUEST: "Export Data"
  }
}

const get_version_1_export_header = () => {
  return {
    VERSION: 1,
    TALLYREQUEST: "Export",
  }
}

const get_version_1_import_header = () => {
  return {
    VERSION: 1,
    TALLYREQUEST: "Import",
  }
}


const get_static_variables = () => {
  return {
    SVEXPORTFORMAT: "$$SysName:XML"
  }
}

const get_accounts_list_request = () => {
  const header = get_export_data_header();

  const body = {
    EXPORTDATA: {
      REQUESTDESC: {
        REPORTNAME: "List of Accounts",
        STATICVARIABLES: {
          ...get_static_variables(),
          ACCOUNTTYPE: "All Inventory Masters"
        }
      }
    }
  }


  return create_export_request(header, body)
}

const get_ledgers_list_request = () => {
  const header = {
    ...get_version_1_export_header(),
    TYPE: "COLLECTION",
    ID: "List of Ledgers"
  }

  const body = {
    EXPORTDATA: {
      DESC: {
        STATICVARIABLES: get_static_variables()
      }
    }
  }

  return create_export_request(header, body)
}

const get_balance_sheet_request = () => {
  const header = get_export_data_header();

  const body = {
    EXPORTDATA: {
      REQUESTDESC: {
        STATICVARIABLES: get_static_variables(),
        REPORTNAME: "Balance Sheet"
      }
    }
  }

  return create_export_request(header, body)
}

const get_profit_loss_request = () => {
  const header = get_export_data_header();

  const body = {
    EXPORTDATA: {
      REQUESTDESC: {
        STATICVARIABLES: {
          ...get_static_variables(),
          SVFROMDATE: "20220401",
          SVTODATE: "20230331"
        },
        REPORTNAME: "Profit and Loss"
      }
    }
  }

  return create_export_request(header, body)
}


const get_trial_balance_request = () => {
  const header = get_export_data_header();

  const body = {
    EXPORTDATA: {
      REQUESTDESC: {
        STATICVARIABLES: get_static_variables(),
        REPORTNAME: "Trial Balance"
      }
    }
  }
  return create_export_request(header, body)
}

const get_day_book_request = () => {
  const header = get_export_data_header();

  const body = {
    EXPORTDATA: {
      REQUESTDESC: {
        STATICVARIABLES: {
          ...get_static_variables(),
          SVFROMDATE: "20220401",
          SVTODATE: "20230331"
        },
        REPORTNAME: "Voucher Register"
      }
    }
  }

  return create_export_request(header, body)
}

// opening_amount should be negative for a positive opening balance
//
const create_ledger_request = (ledger_name, ledger_group_name, opening_amount) => {
  const header = {
    ...get_version_1_import_header(),
    TYPE: "Data",
    ID: "All Masters"
  }

  const body = {
    DESC: {
      STATICVARIABLES: {
        IMPORTDUPS: "@@DUPCOMBINE"
      }
    },
    DATA: {
      TALLYMESSAGE: {
        LEDGER: {
          '$': {
            NAME: ledger_name,
            Action: 'Create'
          },
          NAME: ledger_name,
          PARENT: ledger_group_name,
          OPENINGBALANCE: opening_amount
        }
      }
    }
  }

  return create_export_request(header, body)
}

const create_ledger_group_request = (ledger_group_name, parent_ledger_group_name) => {
  const header = {
    ...get_version_1_import_header(),
    TYPE: "Data",
    ID: "All Masters"
  }

  const body = {
    DESC: {
      STATICVARIABLES: {
        IMPORTDUPS: "@@DUPCOMBINE"
      }
    },
    DATA: {
      TALLYMESSAGE: {
        GROUP: {
          '$': {
            NAME: ledger_group_name,
            Action: 'Create'
          },
          NAME: ledger_group_name,
          PARENT: parent_ledger_group_name
        }
      }
    }
  }

  return create_export_request(header, body)
}



const create_voucher_request = (date, voucher_type, debit_ledger, credit_ledger, amount, narration) => {
  const header = {
    ...get_version_1_import_header(),
    TYPE: "Data",
    ID: "Vouchers"
  }

  const voucher = {
    DATE: date,
    NARRATION: narration,
    VOUCHERTYPENAME: voucher_type,
    VOUCHERNUMBER: 1
  };

  voucher['ALLLEDGERENTRIES.LIST'] = [
    {
      LEDGERNAME: debit_ledger,
      ISDEEMEDPOSITIVE: "Yes",
      AMOUNT: -amount
    },
    {
      LEDGERNAME: credit_ledger,
      ISDEEMEDPOSITIVE: "No",
      AMOUNT: amount
    }
  ]

  const body = {
    DESC: {},
    DATA: {
      TALLYMESSAGE: {
        VOUCHER: [voucher]
      }
    }
  }

  return create_export_request(header, body)

}


const create_unit_name_request = (unit_name) => {
  const header = {
    ...get_version_1_import_header(),
    TYPE: "Data",
    ID: "All Masters"
  }

  const body = {
    DESC: {
      STATICVARIABLES: {
        IMPORTDUPS: "@@DUPCOMBINE"
      }
    },
    DATA: {
      TALLYMESSAGE: {
        UNIT: {
          '$': {
            NAME: unit_name,
            Action: 'Create'
          },
          NAME: unit_name,
          ISSIMPLEUNIT: "Yes",
          FORPAYROLL: "No"
        }
      }
    }
  }

  return create_export_request(header, body)
}


const create_stock_group_request = (stock_group_name, parent_stock_group_name) => {
  const header = {
    ...get_version_1_import_header(),
    TYPE: "Data",
    ID: "All Masters"
  }

  const body = {
    DESC: {
      STATICVARIABLES: {
        IMPORTDUPS: "@@DUPCOMBINE"
      }
    },
    DATA: {
      TALLYMESSAGE: {
        STOCKGROUP: {
          '$': {
            NAME: stock_group_name,
            Action: 'Create'
          },
          NAME: stock_group_name,
          PARENT: parent_stock_group_name
        }
      }
    }
  }

  return create_export_request(header, body)
}


module.exports = {
  get_accounts_list_request,
  get_ledgers_list_request,
  get_balance_sheet_request,
  get_profit_loss_request,
  get_trial_balance_request,
  get_day_book_request,
  create_ledger_request,
  create_ledger_group_request,
  create_voucher_request,
  create_unit_name_request,
  create_stock_group_request
}