import cysimdjson
import json

def load_json(path: str) -> dict:
    parser = cysimdjson.JSONParser()
    json = parser.load(path)

    parsed_json = _parse_cysimdjson_JSONObject(json)

    return parsed_json

def _parse_cysimdjson_JSONObject(JSONObject) -> dict:
    parsed_json = {}
    for item in JSONObject.items():
        if type(item[1]) == cysimdjson.JSONObject:
            parsed_json[item[0]] = _parse_cysimdjson_JSONObject(item[1])
        elif type(item[1]) == cysimdjson.JSONArray:
            parsed_json[item[0]] = item[1].export()
        else:
            parsed_json[item[0]] = item[1]
    
    return parsed_json

def dump_json(data: dict, path: str):
    with open(path, "w") as f:
        json.dump(data, f)

def pretty_print_json(data: dict):
    print(json.dumps(data, indent=2))
