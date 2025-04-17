import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function ReflexaoPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      
      {/* Menu superior */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Reflexões</h1>
        
        {/* Botão de Criar Nova Reflexão */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 shadow">
              Criar Nova Reflexão
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white rounded-xl shadow-lg">
            <DialogHeader>
              <DialogTitle>Nova Reflexão</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Título da reflexão" />
              <Textarea placeholder="Escreva aqui sua reflexão..." rows={5} />
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards das Reflexões */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="bg-white p-4 shadow rounded-xl">
          <CardContent>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">O sentido do agora</h2>
            <p className="text-gray-600 text-sm">
              Quando me conecto com o momento presente, percebo que todas as respostas que busco já estão aqui...
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white p-4 shadow rounded-xl">
          <CardContent>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Aceitação e controle</h2>
            <p className="text-gray-600 text-sm">
              A aceitação não é resignação, é compreender que nem tudo precisa estar sob o meu controle...
            </p>
          </CardContent>
        </Card>

        {/* Exemplo de outro card */}
        <Card className="bg-white p-4 shadow rounded-xl">
          <CardContent>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Dualidade interna</h2>
            <p className="text-gray-600 text-sm">
              Dentro de mim coexistem dúvidas e certezas, luzes e sombras — e todas fazem parte do meu caminho.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
