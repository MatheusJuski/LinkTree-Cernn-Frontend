import React, { useState, useEffect } from 'react';

// URL base da sua API de Links
const BASE_API_URL = process.env.REACT_APP_API_URL;

const API_URL = `${BASE_API_URL}/api/links`;

const AdminPanel = () => {

    const [links, setLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        url: '',
        departamento: 'Geral',
        tipo_acesso: 'Público', 
    });
    const [editingId, setEditingId] = useState(null);

    

    const fetchLinks = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Falha ao carregar links. Verifique se a API está rodando.');
            }
            const data = await response.json();
            setLinks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    

    const resetForm = () => {
        setFormData({ titulo: '', url: '', departamento: 'Geral', tipo_acesso: 'Público' });
        setEditingId(null);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `${API_URL}/${editingId}` : API_URL;
        
        const dataToSend = { 
            ...formData, 
            id: editingId ? parseInt(editingId) : undefined 
        };

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
            }

            resetForm();
            fetchLinks();

        } catch (error) {
            alert(`Erro ao salvar link: ${error.message}`);
            console.error(error);
        }
    };


    const startEdit = (link) => {
        setFormData(link);
        setEditingId(link.id); 
        window.scrollTo(0, 0); 
    };


    const handleDelete = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir este link? Esta ação é irreversível.")) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            
            if (response.status === 404) {
                 throw new Error('Link não encontrado. Já pode ter sido excluído.');
            }
            if (!response.ok && response.status !== 204) {
                 throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            fetchLinks();

        } catch (error) {
            alert(`Erro ao deletar link: ${error.message}`);
            console.error("Erro ao deletar link:", error);
        }
    };

    
    useEffect(() => {
        fetchLinks();
    }, []);


    if (isLoading && links.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <p className="text-center text-lg">Conectando à API e carregando dados...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <p className="text-red-500 text-center text-xl">
                    Erro de API: {error}
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-10">
            <div className="max-w-4xl mx-auto space-y-10">
                

                <h1 className="text-3xl font-bold border-b border-border pb-3">
                    {editingId ? 'Editar Link Existente' : 'Adicionar Novo Link'}
                </h1>
                
                <form onSubmit={handleSubmit} 
                      className="bg-card p-6 rounded-lg border border-border shadow-2xl grid gap-4 grid-cols-1 md:grid-cols-2">
                    
                    <input className="col-span-full md:col-span-1 p-3 border border-border rounded-md bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-primary" 
                           type="text" name="titulo" value={formData.titulo} onChange={handleChange} 
                           placeholder="Título (Ex: Site de Chamados)" required />
                           
                    <input className="col-span-full md:col-span-1 p-3 border border-border rounded-md bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-primary" 
                           type="url" name="url" value={formData.url} onChange={handleChange} 
                           placeholder="URL (Ex: http://google.com)" required />
                           
                    <input className="col-span-full md:col-span-1 p-3 border border-border rounded-md bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-primary" 
                           type="text" name="departamento" value={formData.departamento} onChange={handleChange} 
                           placeholder="Departamento (Ex: TI, Alunos)" />

                    <div className="flex flex-col col-span-full md:col-span-1">
                        <label className="text-sm font-semibold mb-1 text-muted-foreground">Tipo de Acesso:</label>
                        <select className="p-3 border border-border rounded-md bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-primary" 
                                name="tipo_acesso" value={formData.tipo_acesso} onChange={handleChange} required>
                            <option value="publico">🌐 Público (Acesso Geral)</option>
                            <option value="interno">🔒 Interno (Somente Intranet)</option>
                        </select>
                    </div>

                    <button type="submit" 
                            className={`col-span-full p-3 font-bold rounded-md transition-colors 
                                        ${editingId 
                                            ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                                            : 'bg-accent hover:bg-accent/90 text-accent-foreground'}`}>
                        {editingId ? 'Salvar Edição' : 'Adicionar Link'}
                    </button>
                    
                    {editingId && (
                        <button type="button" onClick={resetForm} 
                                className="col-span-full p-3 font-bold rounded-md bg-muted hover:bg-muted/80 text-foreground transition-colors mt-2">
                            Cancelar Edição
                        </button>
                    )}
                </form>

                {/* 2. Tabela de Links */}
                <h2 className="text-2xl font-bold border-b border-border pb-3 pt-6">
                    Links Atuais ({links.length})
                </h2>
                
                <div className="overflow-x-auto rounded-lg border border-border shadow-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-card/50 text-muted-foreground">
                            <tr>
                                <th scope="col" className="px-6 py-3">Título</th>
                                <th scope="col" className="px-6 py-3">Departamento</th>
                                <th scope="col" className="px-6 py-3">Acesso</th>
                                <th scope="col" className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {links.map((link) => (
                                <tr key={link.id} className="bg-card border-b border-border hover:bg-card/70 transition-colors">
                                    <td className="px-6 py-4 font-medium text-foreground">{link.titulo}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{link.departamento}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                                            ${link.tipo_acesso === 'interno' 
                                                ? 'bg-primary/20 text-primary' 
                                                : 'bg-accent/20 text-accent'}`}>
                                            {link.tipo_acesso === 'interno' ? 'Interno' : 'Público'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex justify-center space-x-2">
                                        <button onClick={() => startEdit(link)} 
                                                className="px-3 py-1 text-sm bg-secondary/70 hover:bg-secondary rounded-md text-foreground transition-colors">
                                            Editar
                                        </button>
                                        <button onClick={() => handleDelete(link.id)} 
                                                className="px-3 py-1 text-sm bg-destructive hover:bg-destructive/80 rounded-md text-destructive-foreground transition-colors">
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;