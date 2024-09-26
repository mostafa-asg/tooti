from parser import ContentParser, ParseResult

def test_translations_result():
    content = """
    **zunehmen**
    *to increase*
    *Ex:* Die Verkaufszahlen haben im Dezember leicht **zugenommen**. (Sales increased slightly in December)
    *Ex:* Als er aufhörte, regelmäßig zu laufen, **nahm** er zu. (Once he stopped running regularly, he gained weight)    

    **deutlich**
    *clear, significant, noticable*
    *Ex:* Die Internetgeschwindigkeit hat in den letzten Jahren **deutlich** zugenommen. (Internet speed has increased significantly over the last years)
    """

    parser = ContentParser(content)
    parse_result = parser.parse()
    
    assert type(parse_result == ParseResult)
    assert len(parse_result.translations) == 3
    
    translations = parse_result.translations
    assert translations[0].question == "Sales increased slightly in December"
    assert translations[0].answer == "Die Verkaufszahlen haben im Dezember leicht zugenommen."
    assert translations[0].hint == "D__ V_____________ h____ i_ D_______ l_____ z_________."
    assert translations[0].answer_words == ["Die", "Verkaufszahlen", "haben", "im" , "Dezember", "leicht", "zugenommen"]                                            
    
    assert translations[1].question == "Once he stopped running regularly, he gained weight"
    assert translations[1].answer == "Als er aufhörte, regelmäßig zu laufen, nahm er zu."
    assert translations[1].hint == "A__ e_ a_______, r_________ z_ l_____, n___ e_ z_."
    assert translations[1].answer_words == ["Als", "er", "aufhörte", "regelmäßig", "zu", "laufen", "nahm", "er", "zu"]

    assert translations[2].question == "Internet speed has increased significantly over the last years"
    assert translations[2].answer == "Die Internetgeschwindigkeit hat in den letzten Jahren deutlich zugenommen."
    assert translations[2].hint == "D__ I______________________ h__ i_ d__ l______ J_____ d_______ z_________."
    assert translations[2].answer_words == ["Die", "Internetgeschwindigkeit", "hat", "in", "den", "letzten", "Jahren", "deutlich", "zugenommen"]
