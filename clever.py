#The program should begin by asking the user for each of the words. It should then, fill those words into the appropriate places in the story.
#import libraries
import random
#words
words = ["adjective", "animal", "verb", "exclamation", "second_verb", "third_verb"]

#load stories

stories = """The other day, I was really in trouble. It all started when I saw a very [adjective] [animal] [verb] across the kitchen floor. "[exclamation]!" I shrieked. But all I could manage was to [second_verb] backwards. Miraculously, that made it freeze, but not before it tried to [third_verb] my breakfast right in front of my family.|The other day, I was really in trouble. It all started when I saw a very [adjective] [animal] [verb] down the hallway. "[exclamation]!" I yelled. But all I could think to do was to [second_verb] over and over. Miraculously, that caused it to stop, but not before it tried to [third_verb] right in front of my family.|While cruising past the Crab Nebula, my spaceship's engine let out a sound like a [adjective] kazoo. Suddenly, a [animal] wearing a tiny visor [verb] out of an airlock. "[exclamation]!" I beeped over the radio. I had no choice but to [second_verb] the hyperdrive in reverse. Miraculously, that caused the toll booth to [third_verb] into a black hole, but not before the creature snatched my snacks.|Three leagues deep in the Briney Abyss, my jellyfish‑proof oven started to spark. That's when a [adjective] [animal] with chef's hat [verb] through the coral reef door. "[exclamation]!" I bubbled. Panicking, I decided to [second_verb] a handful of sea-salt into the valve. Strangely, that made the water boil backwards, but not before it tried to [third_verb] my kelp croissants.|I was enchanting my socks in the spire's basement when a puff of [adjective] smoke revealed a [animal] that [verb] out of a spell book. "[exclamation]!" I incanted. All I could manage was to [second_verb] a wet robe over its head. That calmed it briefly, but not before it tried to [third_verb] my enchanted underwear.|In the middle of a dinosaur custody battle, the stone tablet I was holding suddenly turned [adjective]. A tiny [animal] with a powdered wig [verb] across the judge's bench. "[exclamation]!" I roared. Desperate, I began to [second_verb] my gavel like a maniac. That startled it, but not before it tried to [third_verb] the prosecution's fossil.|At 3 AM in the abandoned arcade, I fed a dollar into a machine that glowed [adjective]. Out popped a [animal] made of pure static, which [verb] straight toward my face. "[exclamation]!" I buzzed. I could only think to [second_verb] the power cord from the wall. That made it flicker, but not before it tried to [third_verb] my bag of chips."""

#process stories
stories = stories.split("|")

#start user interface
print("Please enter the following information:\n")
no = random.randint(1, 7)
template = stories[no-1]

# #request for varibles
for word in words:
    if "verb" in  word:
        exec(f"new_word = input('verb: ')")
    else:
        exec(f"new_word = input('{word.replace("_"," ")}: ')")
    if word == "exclamation":
        new_word = new_word.capitalize()
    template = template.replace(f"[{word}]", new_word)

print(f"""
Your story is:

{template}
""")

