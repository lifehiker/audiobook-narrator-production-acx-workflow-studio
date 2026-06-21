"use client";

import { useState } from "react";
import { PlusCircle, Pencil, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createCharacter, updateCharacter, deleteCharacter } from "@/actions/characters";
import { EmptyState } from "@/components/app/EmptyState";

type CharacterNote = {
  id: string;
  name: string;
  voiceNotes?: string | null;
  accentNotes?: string | null;
  relationshipNotes?: string | null;
  firstAppearance?: string | null;
  notes?: string | null;
};

const emptyForm = {
  name: "",
  voiceNotes: "",
  accentNotes: "",
  relationshipNotes: "",
  firstAppearance: "",
  notes: "",
};

export function CharactersTab({ projectId, initialCharacters }: { projectId: string; initialCharacters: CharacterNote[] }) {
  const [characters, setCharacters] = useState(initialCharacters);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CharacterNote | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (char: CharacterNote) => {
    setEditing(char);
    setForm({
      name: char.name,
      voiceNotes: char.voiceNotes ?? "",
      accentNotes: char.accentNotes ?? "",
      relationshipNotes: char.relationshipNotes ?? "",
      firstAppearance: char.firstAppearance ?? "",
      notes: char.notes ?? "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editing) {
        const updated = await updateCharacter(editing.id, projectId, form);
        setCharacters((prev) => prev.map((c) => (c.id === editing.id ? updated as CharacterNote : c)));
      } else {
        const created = await createCharacter(projectId, form);
        setCharacters((prev) => [...prev, created as CharacterNote]);
      }
      setDialogOpen(false);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error saving");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this character?")) return;
    await deleteCharacter(id, projectId);
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  };

  const filteredCharacters = characters.filter((char) => {
    const haystack = [
      char.name,
      char.voiceNotes,
      char.accentNotes,
      char.relationshipNotes,
      char.firstAppearance,
      char.notes,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return !query || haystack.includes(query.toLowerCase());
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Characters ({characters.length})</h2>
        <Button size="sm" onClick={openCreate}>
          <PlusCircle className="h-4 w-4 mr-1" /> Add Character
        </Button>
      </div>

      {characters.length > 0 && (
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search names, voices, accents, relationships..."
          className="mb-4"
        />
      )}

      {characters.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No characters yet"
          description="Track voice notes and accent guidance for each character."
          action={{ label: "Add First Character", onClick: openCreate }}
        />
      ) : filteredCharacters.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No matching characters"
          description="Clear the search to see the full character sheet."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCharacters.map((char) => (
            <Card key={char.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{char.name}</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(char)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(char.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                {char.firstAppearance && (
                  <p className="text-xs text-gray-500">First: {char.firstAppearance}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {char.voiceNotes && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Voice</span>
                    <p className="text-gray-700">{char.voiceNotes}</p>
                  </div>
                )}
                {char.accentNotes && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Accent</span>
                    <p className="text-gray-700">{char.accentNotes}</p>
                  </div>
                )}
                {char.relationshipNotes && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Relationships</span>
                    <p className="text-gray-700">{char.relationshipNotes}</p>
                  </div>
                )}
                {char.notes && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Notes</span>
                    <p className="text-gray-700">{char.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Character" : "Add Character"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Character name" />
            </div>
            <div>
              <Label>Voice Notes</Label>
              <Textarea value={form.voiceNotes} onChange={(e) => setForm({ ...form, voiceNotes: e.target.value })} placeholder="Voice quality, tone, speech patterns..." rows={2} />
            </div>
            <div>
              <Label>Accent Notes</Label>
              <Input value={form.accentNotes} onChange={(e) => setForm({ ...form, accentNotes: e.target.value })} placeholder="e.g. Neutral American, slight RP British" />
            </div>
            <div>
              <Label>Relationships</Label>
              <Input value={form.relationshipNotes} onChange={(e) => setForm({ ...form, relationshipNotes: e.target.value })} placeholder="Relationship to other characters" />
            </div>
            <div>
              <Label>First Appearance</Label>
              <Input value={form.firstAppearance} onChange={(e) => setForm({ ...form, firstAppearance: e.target.value })} placeholder="Chapter 1, page 5" />
            </div>
            <div>
              <Label>Additional Notes</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading || !form.name}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
