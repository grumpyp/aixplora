import openai

def is_valid_api_key(openai_api_key: str):
    openai.api_key = openai_api_key
    try:
        openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."}
            ]
        )
        return { 'validApiKey': True }
    except Exception as e:
        return {
            'validApiKey': False,
            'message': e.error.message
        }
    